import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES, USER_STATUSES, UserRole, UserStatus } from '../auth.types';

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ nullable: true })
  displayName!: string | null;

  @ApiProperty({ enum: USER_ROLES })
  role!: UserRole;

  @ApiProperty({ enum: USER_STATUSES })
  status!: UserStatus;

  @ApiProperty()
  timezone!: string;
}
