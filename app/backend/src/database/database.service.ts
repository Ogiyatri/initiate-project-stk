import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export default class DatabaseService {
  constructor(@Inject('DATA_SOURCE') private readonly datasource: DataSource) {}

  ping() {
    return this.datasource.isInitialized;
  }
}
