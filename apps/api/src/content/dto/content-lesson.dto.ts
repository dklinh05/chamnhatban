import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateContentItemDto, UpdateContentItemDto } from './content-item.dto';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateContentLessonDto {
  @ApiProperty({ example: 'n5-greetings' })
  @IsString()
  @Matches(slugPattern)
  slug!: string;

  @ApiProperty({ example: 'Chào hỏi cơ bản' })
  @IsString()
  titleVi!: string;

  @ApiProperty({ example: 'Basic greetings' })
  @IsString()
  titleEn!: string;

  @ApiProperty({ example: '基本のあいさつ' })
  @IsString()
  titleJa!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionJa?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiPropertyOptional({ type: [CreateContentItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContentItemDto)
  items?: CreateContentItemDto[];
}

export class UpdateContentLessonDto {
  @ApiPropertyOptional({ example: 'n5-greetings' })
  @IsOptional()
  @IsString()
  @Matches(slugPattern)
  slug?: string;

  @ApiPropertyOptional({ example: 'Chào hỏi cơ bản' })
  @IsOptional()
  @IsString()
  titleVi?: string;

  @ApiPropertyOptional({ example: 'Basic greetings' })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({ example: '基本のあいさつ' })
  @IsOptional()
  @IsString()
  titleJa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionJa?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({ type: [UpdateContentItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateContentItemDto)
  items?: UpdateContentItemDto[];
}
