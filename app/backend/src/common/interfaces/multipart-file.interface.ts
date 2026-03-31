export interface MultipartFile {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  fieldname: string;
  encoding: string;
}
