import { IsEmail, 
         IsString, 
         IsStrongPassword} from "class-validator";

export class LoginDto{
    @IsEmail({}, { message: 'Enter a valid email address' })
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;
}