import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseEntity {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  setId(id: string) {
    this.id = id;
    return this;
  }

  @ApiProperty({ description: 'Creation timestamp', type: 'string', format: 'date-time' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
    return this;
  }

  @ApiProperty({ description: 'Last update timestamp', type: 'string', format: 'date-time' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
    return this;
  }
}
