import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id }; // Payload for the token
    return this.jwtService.sign(payload); // Generate the token
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token); // Verify the token
  }
}
