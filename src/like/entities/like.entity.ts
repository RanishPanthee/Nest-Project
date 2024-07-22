import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "src/users/entities/user.entity";
import { Blog } from "src/blog-post/entities/blog.entity";

@Entity()
export class Likes {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, user => user.likes)
    user: Users;

    @ManyToOne(() => Blog, blog => blog.likes)
    blog: Blog;

    @CreateDateColumn()
    createdAt: Date;
}
