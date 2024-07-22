import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class LoginDto{
    @IsEmail({}, { message: 'Enter a valid email address' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[!@#$%^&*]/, { message: 'Password must contain at least one special character' })
    password: string;
}