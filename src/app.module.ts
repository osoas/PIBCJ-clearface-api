import { Module } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: [PrismaService, UserService],
})
export class AppModule {}
