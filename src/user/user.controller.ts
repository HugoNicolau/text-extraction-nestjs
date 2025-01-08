import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Get,
  Req,
  Res,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response as ExpressResponse } from 'express'; // Import the correct Response type

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      const { user, token } = await this.userService.signUp(createUserDto);
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
        path: '/',
      });
      return { user };
    } catch (error) {
      if (error.message === 'Email already exists') {
        throw new ConflictException('Email already exists');
      }
      if (error.message === 'Username already exists') {
        throw new ConflictException('Username already exists');
      }
      throw error; // Re-throw other errors
    }
  }

  @Post('signin')
  async signin(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      const { user, token } = await this.userService.signIn(
        createUserDto.email,
        createUserDto.password,
      );
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
        path: '/',
      });
      return { user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  @Post('logout')
  async logout(@Res() res: ExpressResponse) {
    res.clearCookie('authToken', {
      path: '/',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req): Promise<any> {
    const userId = req.user.id;
    return this.userService.getProfile(userId);
  }
}
