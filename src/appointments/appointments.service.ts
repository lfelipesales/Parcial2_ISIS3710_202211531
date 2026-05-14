import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly usersRepository: Repository<Appointment>,

    @InjectRepository(Appointment)
    private readonly rolesRepository: Repository<Appointment>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },

      relations: ['roles'],
    });
  }

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);

    return await this.usersRepository.save(user);
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({
      where: { id },

      relations: ['roles'],
    });
  }
}
