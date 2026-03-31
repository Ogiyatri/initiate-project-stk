import { ApiProperty } from "@nestjs/swagger";

export class BaseApiResponse<T = undefined> {
  @ApiProperty({ description: "Response message", example: "Success" })
  message: string;

  @ApiProperty({ description: "Response data", nullable: true })
  data?: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
  }
}
