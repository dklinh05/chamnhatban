import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentItemType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateContentItemDto {
  @ApiProperty({ example: 'ohayou' })
  @IsString()
  @Matches(slugPattern)
  slug!: string;

  @ApiProperty({ enum: ContentItemType })
  @IsEnum(ContentItemType)
  type!: ContentItemType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({ example: 'おはよう' })
  @IsString()
  sourceJa!: string;

  @ApiPropertyOptional({ example: 'ohayou' })
  @IsOptional()
  @IsString()
  reading?: string;

  @ApiProperty({ example: 'Chào buổi sáng' })
  @IsString()
  meaningVi!: string;

  @ApiProperty({ example: 'Good morning' })
  @IsString()
  meaningEn!: string;

  @ApiProperty({ example: 'おはよう' })
  @IsString()
  meaningJa!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notesVi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notesEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notesJa?: string;
}

export class UpdateContentItemDto {
  @ApiPropertyOptional({ example: 'ohayou' })
  @IsOptional()
  @IsString()
  @Matches(slugPattern)
  slug?: string;

  @ApiPropertyOptional({ enum: ContentItemType })
  @IsOptional()
  @IsEnum(ContentItemType)
  type?: ContentItemType;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({ example: 'おはよう' })
  @IsOptional()
  @IsString()
  sourceJa?: string;

  @ApiPropertyOptional({ example: 'ohayou' })
  @IsOptional()
  @IsString()
  reading?: string;

  @ApiPropertyOptional({ example: 'Chào buổi sáng' })
  @IsOptional()
  @IsString()
  meaningVi?: string;

  @ApiPropertyOptional({ example: 'Good morning' })
  @IsOptional()
  @IsString()
  meaningEn?: string;

  @ApiPropertyOptional({ example: 'おはよう' })
  @IsOptional()
  @IsString()
  meaningJa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notesVi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notesEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notesJa?: string;
}
