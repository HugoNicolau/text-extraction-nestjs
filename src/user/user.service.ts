import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ user: any; token: string }> {
    const { username, email, password } = createUserDto;

    // Validate password
    if (!password) {
      throw new Error('Password is required');
    }

    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already exists');
      }
      if (existingUser.username === username) {
        throw new Error('Username already exists');
      }
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.jwtService.sign({
      id: savedUser.id,
      email: savedUser.email,
    });

    return { user: savedUser, token };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: any; token: string }> {
    if (!password) {
      throw new Error('Password is required');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { user, token };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
      user.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return this.userRepository.save(user);
  }

  async googleLogin(req: any): Promise<User> {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const { email, firstName, lastName } = req.user;
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
      const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

      user = this.userRepository.create({
        email,
        username: `${firstName} ${lastName}`,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
