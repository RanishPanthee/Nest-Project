import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService, 
    ) {
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = {
            sub: user.id
        };

        const jwtSecretKey = this.configService.get<string>('jwtSecretKey'); 
        const jwtRefreshTokenKey = this.configService.get<string>('jwtRefreshTokenKey'); 

        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '5h',
                    secret: jwtSecretKey,
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret: jwtRefreshTokenKey,
                })
            }
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }


}