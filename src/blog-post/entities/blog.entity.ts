import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Likes } from 'src/like/entities/like.entity';
import { Users } from "src/users/entities/user.entity";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column('text')
    content: string;

    @Column()
    category: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    authorName: string;

    @OneToMany(() => Likes, (like) => like.blog, {cascade: true, onDelete: 'CASCADE'})
    likes: Likes[];

    @Column({ default: 0 })
    likesCount: number;

    @ManyToOne(() => Users, (user) => user.blogs, { onDelete: 'CASCADE' })
    author: Users;

    @Column({nullable: true})
    imageUrl: string;

}
