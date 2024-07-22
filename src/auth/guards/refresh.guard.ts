import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';

@Injectable()
export class RefreshJwtGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Authorization header missing');
        }

        try {
            const jwtRefreshTokenKey = this.configService.get<string>('jwtRefreshTokenKey');
            const payload = await this.jwtService.verifyAsync(token, { secret: jwtRefreshTokenKey });

            request.user = payload; 

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (authHeader && typeof authHeader === 'string') {
            const [type, token] = authHeader.split(' ') ?? [];
            return type === 'Refresh' ? token : undefined;
        }
        return undefined;
    }
}
