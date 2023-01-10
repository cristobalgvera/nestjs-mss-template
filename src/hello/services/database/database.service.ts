import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cashin } from '../../../entities/cashin/cashin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Cashin)
    private usersRepository: Repository<Cashin>,
  ) {}

  findAll(): Promise<Cashin[]> {
    return this.usersRepository.find();
  }

  // findOne(id: number): Promise<Cashin> {
  //   return this.usersRepository.findOne({ id });
  // }

  // async remove(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
