import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Task} from '../tasks/tasks.entity';
import {Exclude} from 'class-transformer';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    @Exclude()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
