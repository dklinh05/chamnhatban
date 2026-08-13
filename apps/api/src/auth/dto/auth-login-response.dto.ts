import { ApiProperty } from '@nestjs/swagger';
import { AuthResponseDto } from './auth-response.dto';

export class AuthLoginResponseDto extends AuthResponseDto {
  @ApiProperty()
  accessToken!: string;
}
