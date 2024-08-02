import { CanActivate, 
         ExecutionContext, 
         Injectable, 
         UnauthorizedException } from "@nestjs/common";
         
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Authorization header missing');
        }

        try {
            const jwtSecretKey = this.configService.get<string>('jwtSecretKey');
            const payload = await this.jwtService.verifyAsync(token, { secret: jwtSecretKey });

            const user = await this.usersService.findOne(payload.sub);

            if (!user) {
                throw new UnauthorizedException('User does not exist');
            }

            request.user = user;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (authHeader && typeof authHeader === 'string') {
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }
}
