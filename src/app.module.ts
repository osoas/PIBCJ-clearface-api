import { Module } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [UserModule],
  controllers: [],
  providers: [PrismaService, UserService],
})
export class AppModule {}
