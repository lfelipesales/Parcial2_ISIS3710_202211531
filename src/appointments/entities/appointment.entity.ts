import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { OneToMany } from 'typeorm/browser/decorator/relations/OneToMany.js';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  datetime!: Date;

  @Column()
  status!: string;

  @Column()
  created_at!: Date;

  @OneToMany(() => User, (user) => user.appointments)
  users!: User[];
}
