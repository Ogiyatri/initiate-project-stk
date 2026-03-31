import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { MultipartFile } from "../interfaces/multipart-file.interface";

interface RequestWithFiles {
  incomingFiles?: Record<string, MultipartFile[]>;
}

export const UploadedFiles = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithFiles>();
    const files = request.incomingFiles;
    return data ? files?.[data] : files;
  },
);
