import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // Skip auth module
    if (request.url.includes("/auth/")) {
      throw exception;
    }

    const driverError = exception.driverError as any;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    // Postgres Foreign Key Violation
    if (driverError?.code === "23503") {
      status = HttpStatus.BAD_REQUEST;
      message = driverError.detail
        ? this.formatForeignKeyMessage(driverError.detail)
        : "Data referensi yang dimasukkan tidak ditemukan di sistem.";
    }

    // Postgres Unique Violation
    if (driverError?.code === "23505") {
      status = HttpStatus.CONFLICT;
      message = driverError.detail
        ? this.formatUniqueMessage(driverError.detail)
        : "Data yang dikirimkan sudah ada di sistem.";
    }

    // Postgres Not Null Violation
    if (driverError?.code === "23502") {
      status = HttpStatus.BAD_REQUEST;
      message = driverError.column
        ? `Kolom '${driverError.column}' tidak boleh kosong.`
        : "Terdapat kolom wajib yang belum diisi.";
    }

    void response.status(status).send({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private formatForeignKeyMessage(detail: string): string {
    const match = detail.match(/Key \((.+)\)=\((.+)\) is not present/);
    if (match) {
      return `Referensi '${match[1]}' dengan nilai '${match[2]}' tidak ditemukan.`;
    }
    return "Data referensi tidak ditemukan di sistem.";
  }

  private formatUniqueMessage(detail: string): string {
    const match = detail.match(/Key \((.+)\)=\((.+)\) already exists/);
    if (match) {
      return `Data dengan ${match[1]} '${match[2]}' sudah ada di sistem.`;
    }
    return "Data yang dikirimkan sudah ada di sistem.";
  }
}
