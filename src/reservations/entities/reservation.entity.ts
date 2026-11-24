import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ParkingSpot } from '../../parking-spots/entities/parking-spot.entity.js';
import { User } from '../../users/entities/user.entity.js';


@Entity('reservations')
export class Reservation {

  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ nullable: false })
  id_user: number;

  @Column({ nullable: false })
  id_spot: number;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false })
  vehicle_plate: string;

  @Column({ nullable: false, type: 'enum', enum: ['standard', 'fast', 'ultra_fast'] })
  vehicle_max_charge: 'standard' | 'fast' | 'ultra_fast';

  @Column({ nullable: false, type: 'enum', enum: ['pending', 'completed', 'cancelled'] })
    status: 'pending' | 'completed' | 'cancelled';
  
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (users) => users.id)
  user: User;

  @ManyToOne(() => ParkingSpot, (parkingSpot) => parkingSpot.id)
  parkingSpot: ParkingSpot; 


}