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

interface MultipartFilePart {
  type: "file";
  fieldname: string;
  filename: string;
  mimetype: string;
  encoding: string;
  toBuffer: () => Promise<Buffer>;
}

interface MultipartFieldPart {
  type: "field";
  fieldname: string;
  value: unknown;
}

interface ExtendedRequest extends FastifyRequest {
  incomingFiles?: Record<string, MultipartFile[]>;
}

@Injectable()
export class FastifyMultipartInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
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
        const filePart = part as unknown as MultipartFilePart;
        const [err, buffer] = await awaitToError(filePart.toBuffer());
        if (err) {
          throw new BadRequestException(`Failed to read file: ${err.message}`);
        }
        const file: MultipartFile = {
          buffer: buffer,
          filename: filePart.filename,
          mimetype: filePart.mimetype,
          fieldname: filePart.fieldname,
          encoding: filePart.encoding,
        };
        if (!files[filePart.fieldname]) {
          files[filePart.fieldname] = [];
        }
        files[filePart.fieldname].push(file);
      } else if (part.type === "field") {
        const body = request.body as Record<string, unknown>;
        const fieldPart = part as unknown as MultipartFieldPart;
        body[fieldPart.fieldname] = this.tryParseJson(fieldPart.value);
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
