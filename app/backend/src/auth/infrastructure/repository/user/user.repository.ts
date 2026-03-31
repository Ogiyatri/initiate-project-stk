import { Inject, Injectable } from "@nestjs/common";
import BaseRepository from "@/database/base-repository";
import { DATA_SOURCE_KEY } from "@/database/provider";
import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";

@Injectable()
export default class UserRepository extends BaseRepository<UserEntity> {
  constructor(@Inject(DATA_SOURCE_KEY) ds: DataSource) {
    super(UserEntity, ds);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      select: [
        "id",
        "email",
        "passwordHash",
        "fullName",
        "phone",
        "role",
        "status",
        "lastLoginAt",
        "createdAt",
        "updatedAt",
      ],
    });
  }
}
