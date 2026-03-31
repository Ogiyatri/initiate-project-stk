import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export abstract class BaseSeeder {
  protected logger: Logger;

  constructor(protected dataSource: DataSource) {
    this.logger = new Logger(this.constructor.name);
  }

  abstract run(): Promise<void>;
}
