import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';


@Entity('parking_spots')
export class ParkingSpot {



    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })    
    code: string;

    @Column({ nullable: false, type: 'enum', enum: ['standard', 'fast', 'ultra_fast'] })
    charger_type: 'standard' | 'fast' | 'ultra_fast';

    @Column({ nullable: false })
    id_supervisor: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (users) => users.id)
    user: User;
}
