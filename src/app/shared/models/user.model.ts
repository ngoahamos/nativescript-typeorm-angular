import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinColumn } from "typeorm/browser";
import { Todo } from "./todo.model";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    name?: string;
    @OneToMany(type => Todo, todo => todo.user, {cascade: true})
    @JoinColumn()
    todos?: Todo[];
}