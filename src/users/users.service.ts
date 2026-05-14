import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository }
from '@nestjs/typeorm';

import {
  In,
  Repository,
} from 'typeorm';

import { User }
from './entities/user.entity';

import { Role }
from '../roles/entities/role.entity';

@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(User)

    private readonly usersRepository:
      Repository<User>,

    @InjectRepository(Role)

    private readonly rolesRepository:
      Repository<Role>,
  ) {}

  async findByEmail(
    email: string,
  ) {

    return await this.usersRepository.findOne({

      where: { email },

      relations: ['roles'],
    });
  }

  async create(
    userData: Partial<User>,
  ) {

    const user =
      this.usersRepository.create(
        userData,
      );

    return await this.usersRepository.save(
      user,
    );
  }

  async findById(id: string) {

    return await this.usersRepository.findOne({

      where: { id },

      relations: ['roles'],
    });
  }

  async assignRoles(
    userId: string,

    roleNames: string[],
  ) {

    const user =
      await this.usersRepository.findOne({

        where: {
          id: userId,
        },
      });

    if (!user) {

      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const roles =
      await this.rolesRepository.find({

        where: {
          role_name: In(roleNames),
        },
      });

    if (
      roles.length !== roleNames.length
    ) {

      throw new BadRequestException(
        'roles inválidos',
      );
    }

    user.roles = roles;

    await this.usersRepository.save(
      user,
    );

    return {
      message: 'Roles asignados',
    };
  }
}