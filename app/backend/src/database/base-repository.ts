import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ObjectLiteral,
  Repository,
  DataSource,
  QueryFailedError,
  type EntityTarget,
  FindOptionsWhere,
} from 'typeorm';
import awaitToError from '@/common/error/await-to-error';

export interface BaseEntityInterface<TId = string> extends ObjectLiteral {
  id: TId;
}

@Injectable()
export default class BaseRepository<TEntity extends BaseEntityInterface> {
  public repository: Repository<TEntity>;
  protected tableName: string;
  protected dataSource: DataSource;

  constructor(entity: EntityTarget<TEntity>, datasource: DataSource) {
    this.dataSource = datasource;
    this.repository = datasource.getRepository(entity);
    this.tableName = this.repository.metadata.tableName;
  }

  async createIfNoExists(entity: TEntity) {
    const [err, result] = await awaitToError(this.repository.save(entity));
    if (err) {
      if (
        err instanceof QueryFailedError &&
        (err as QueryFailedError & { driverError?: { errno?: number } })
          .driverError?.errno === 1062
      ) {
        return null;
      }
      throw err instanceof Error ? err : new Error(String(err));
    }
    return result;
  }

  async findOneById(id: string) {
    const result = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<TEntity>);
    if (!result) {
      throw new NotFoundException(
        `${this.tableName} with id ${id} does not exist`,
      );
    }
    return result;
  }

  async isExists(id: string) {
    return this.repository.exists({ where: { id } as FindOptionsWhere<TEntity> });
  }
}
