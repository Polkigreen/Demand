import { IsNotEmpty, IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class InitiateBankIdDto {
  @IsOptional()
  @IsString()
  @Length(12, 12, { message: 'Personnummer must be 12 digits (YYYYMMDDXXXX)' })
  personnummer?: string;

  @IsNotEmpty()
  @IsString()
  platform: 'web' | 'mobile';
}

export class CollectBankIdDto {
  @IsNotEmpty()
  @IsString()
  orderRef: string;
}

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class EmailRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 100, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class EmailLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
