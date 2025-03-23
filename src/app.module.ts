import { Module } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ImagesModule } from './modules/images/images.module';
import { ImagesService } from './modules/images/images.service';



@Module({
  imports: [UserModule, AuthModule, AppointmentsModule, ImagesModule],
  controllers: [],
  providers: [PrismaService, UserService, ImagesService],
})
export class AppModule {}
