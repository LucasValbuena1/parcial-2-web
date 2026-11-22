import {
  Column, CreateDateColumn, Entity, ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    role_name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    // Lado inverso de la N:M (no crea tabla, solo permite navegar role.users)
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
