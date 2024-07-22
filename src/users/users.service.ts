import { Get, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Blog } from 'src/blog-post/entities/blog.entity';

@Injectable()
export class UsersService {

  constructor( @InjectRepository(Users) private readonly userRepository: Repository<Users>, @InjectRepository(Users) private readonly blogRepository: Repository<Blog>){}
  

  async create(createUserDto: CreateUserDto): Promise <Users> {

    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

    if (existingUser) {
      throw new ConflictException('Email already registered !!');
    }
    
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    createUserDto.password = hashPassword;
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user)
  }

  async findAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with given email not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    await this.findOne(id); 
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); 
    await this.userRepository.remove(user);
  }

  // async findBlogsByUser(user: Users): Promise<Blog[]> {
  //   return this.blogRepository.find({
  //     where: { author: user },
  //     relations: ['blogs'],
  //   });
  // }
}