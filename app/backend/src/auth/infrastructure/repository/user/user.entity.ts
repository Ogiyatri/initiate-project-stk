import { ApiProperty } from '@nestjs/swagger';
import BaseEntity from '@/database/base-entity';
import { Column, Entity } from 'typeorm';
import { UserRole } from '@/auth/domain/types/user-role.enum';
import { UserStatus } from '@/auth/domain/types/user-status.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @Column('varchar', { length: 255, nullable: false, unique: true, name: 'email' })
  email: string;

  @ApiProperty({ description: 'User password hash' })
  @Column('varchar', { length: 255, nullable: false, name: 'password_hash', select: false })
  passwordHash: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @Column('varchar', { length: 255, nullable: false, name: 'full_name' })
  fullName: string;

  @ApiProperty({ description: 'User phone number', example: '+628123456789' })
  @Column('varchar', { length: 20, nullable: true, name: 'phone' })
  phone: string | null;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, nullable: false, name: 'role' })
  role: UserRole;

  @ApiProperty({ description: 'User account status', enum: UserStatus })
  @Column({
    type: 'enum',
    enum: UserStatus,
    nullable: false,
    default: UserStatus.ACTIVE,
    name: 'status',
  })
  status: UserStatus;

  @ApiProperty({ description: 'Last login timestamp', nullable: true })
  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date | null;
}
