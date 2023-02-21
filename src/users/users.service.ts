import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new UnauthorizedException('Please choose another username');
      }
      throw new InternalServerErrorException(e);
    }
    return user;
  }

  async signin(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = createUserDto;
    const user: User = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user && bcrypt.compare(password, user.password)) {
      const payload = {
        id: user.id,
        username: user.username,
      };
      const access_token: string = await this.jwtService.sign(payload);
      return { access_token };
    } else {
      throw new UnauthorizedException('Please check login credentils');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
