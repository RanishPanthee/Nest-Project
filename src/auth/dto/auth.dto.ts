import { IsEmail, IsString, IsStrongPassword, Matches, MinLength } from "class-validator";

export class LoginDto{
    @IsEmail({}, { message: 'Enter a valid email address' })
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;
}