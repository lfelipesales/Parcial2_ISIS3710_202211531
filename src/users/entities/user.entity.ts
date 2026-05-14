import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({
    nullable: true,
  })
  phone!: string;

  @Column({
    default: true,
  })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinTable()
  roles!: Role[];
}
