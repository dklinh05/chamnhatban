import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ format: 'email', maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
