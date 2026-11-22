import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity.js';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    // select: false -> nunca sale en las consultas; en el login se pide con addSelect('user.password')
    @Column({ select: false })
    password: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    // Lado dueño de la relación N:M: aquí vive la tabla intermedia users_roles
    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: 'users_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];
}
