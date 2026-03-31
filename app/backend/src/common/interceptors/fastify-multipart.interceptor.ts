import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { MultipartFile } from "../interfaces/multipart-file.interface";
import { FastifyRequest } from "fastify";
import awaitToError from "@/common/error/await-to-error";

interface ExtendedRequest extends FastifyRequest {
  incomingFiles?: Record<string, MultipartFile[]>;
  body: any;
}

@Injectable()
export class FastifyMultipartInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<ExtendedRequest>();

    if (typeof request.isMultipart !== "function" || !request.isMultipart()) {
      return next.handle();
    }

    request.body = request.body || {};
    const files: Record<string, MultipartFile[]> = {};

    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === "file") {
        const [err, buffer] = await awaitToError((part as any).toBuffer());
        if (err) {
          throw new BadRequestException(
            `Failed to read file: ${(err as Error).message}`,
          );
        }
        const file: MultipartFile = {
          buffer: buffer as Buffer,
          filename: (part as any).filename,
          mimetype: (part as any).mimetype,
          fieldname: part.fieldname,
          encoding: (part as any).encoding,
        };
        if (!files[part.fieldname]) {
          files[part.fieldname] = [];
        }
        files[part.fieldname].push(file);
      } else if (part.type === "field") {
        const body = request.body as Record<string, any>;
        const value = (part as any).value as unknown;
        body[part.fieldname] = this.tryParseJson(value);
      }
    }

    request.incomingFiles = files;
    return next.handle();
  }

  private tryParseJson(value: unknown): unknown {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
