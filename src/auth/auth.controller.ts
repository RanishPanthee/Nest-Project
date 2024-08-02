import { Body, 
        Controller, 
        Post} from '@nestjs/common';
        
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService} from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (private usersService: UsersService, private authService: AuthService,) {}

    @Post('sign-up')
    async registerUser(@Body() createUserDto: CreateUserDto){
        return await this.usersService.create(createUserDto)

    }

    @Post('log-in')
    async logInUser(@Body() loginDto: LoginDto){
       return await this.authService.login(loginDto) 
    }


}
