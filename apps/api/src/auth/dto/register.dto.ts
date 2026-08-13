import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ format: 'email', maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional({ maxLength: 80 })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  displayName?: string;

  @ApiPropertyOptional({ maxLength: 64 })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}
