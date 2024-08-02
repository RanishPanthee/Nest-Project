import { Exclude } from 'class-transformer';
import { Blog } from 'src/blog-post/entities/blog.entity';
import { Likes } from 'src/like/entities/like.entity';
import { Entity, 
         Column, 
         PrimaryGeneratedColumn, 
         OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({select: false})
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Likes, like => like.user, {cascade: true, onDelete: 'CASCADE'})
  likes: Likes[];

  @OneToMany(() => Blog, (blog) => blog.author, {cascade: true, onDelete: 'CASCADE'})
  blogs: Blog[];
}