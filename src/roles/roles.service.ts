import { ConflictException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.rolesRepository.findOne({
      where: {
        role_name: createRoleDto.role_name,
      },
    });

    if (existingRole) {
      throw new ConflictException('role_name ya existe');
    }

    const role = this.rolesRepository.create(createRoleDto);

    const savedRole = await this.rolesRepository.save(role);

    return {
      message: 'Rol creado con éxito',

      roleId: savedRole.id,
    };
  }

  async findAll() {
    return this.rolesRepository.find();
  }
}
