import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login.dto';
import { SignupDto } from './dto/sign-up.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    return this.authService.signup(
      signupDto.username,
      signupDto.email,
      signupDto.password,
    );
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<LoginResponseDto> {
    return this.authService.login(email, password);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    console.log('logout');
    res.clearCookie('authToken', { path: '/' });
    return res.status(200).send({ message: 'Logged out successfully' });
  }
}
