import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() avatarUrl?: string;
}
