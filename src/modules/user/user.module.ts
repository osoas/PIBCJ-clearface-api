import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/shared/lib/env';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [UserService,PrismaService,AuthService,JwtService],
  controllers: [UserController],
})
export class UserModule {}
