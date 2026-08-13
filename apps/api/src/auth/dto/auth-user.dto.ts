import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ nullable: true })
  displayName!: string | null;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty()
  timezone!: string;
}
