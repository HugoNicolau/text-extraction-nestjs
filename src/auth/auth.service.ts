import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }
}
