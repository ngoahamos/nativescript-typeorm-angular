import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm/browser";
import { User } from "./user.model";
@Entity()
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    task?: string;
    @Column()
    done?: boolean;
    @ManyToOne(type => User, user => user.todos)
    @JoinColumn()
    user?: User;
}