import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[AuthModule],
  providers: [UserService,PrismaService,AuthService],
  controllers: [UserController],
})
export class UserModule {}
