import { IsEmail, 
         IsString, 
         IsStrongPassword} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
