import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BaseApiResponse } from "../response/base-api.response";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string }>();

    return next.handle().pipe(
      map((data: unknown): unknown => {
        if (data instanceof BaseApiResponse) {
          return data;
        }

        if (data === null) {
          throw new NotFoundException("Data tidak ditemukan");
        }

        if (data === undefined) {
          return new BaseApiResponse(this.getDefaultMessage(request.method));
        }

        if (this.isPaginatedResponse(data)) {
          return data;
        }

        return new BaseApiResponse(
          this.getDefaultMessage(request.method),
          data as T,
        );
      }),
    );
  }

  private isPaginatedResponse(data: unknown): boolean {
    if (!data || typeof data !== "object") return false;
    return (
      "data" in data && "total" in data && "page" in data && "pageSize" in data
    );
  }

  private getDefaultMessage(method: string): string {
    const messages: Record<string, string> = {
      GET: "Data retrieved successfully",
      POST: "Data created successfully",
      PUT: "Data updated successfully",
      PATCH: "Data updated successfully",
      DELETE: "Data deleted successfully",
    };
    return messages[method] ?? "Success";
  }
}
