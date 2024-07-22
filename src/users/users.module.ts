import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { Likes } from 'src/like/entities/like.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Users, Likes])],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard, JwtService],
  exports: [UsersService, TypeOrmModule], 
})
export class UsersModule {}
