import { Module, UseInterceptors } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ImagesModule } from './modules/images/images.module';
import { ImagesService } from './modules/images/images.service';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';


// @UseInterceptors(CacheInterceptor) learn this later (in future this allows us to don't even look at services level)
@Module({
  imports: [UserModule, AuthModule, AppointmentsModule, ImagesModule, 
    CacheModule.register({
      stores:[], //Quais 'stores' vão receber os caches (no nosso caso o Redis),
      isGlobal:true, //Define nosso uso de cache como global (Posso utilizar em qualquer lugar sem ter que importar)
    })
  ],
  controllers: [],
  providers: [PrismaService, UserService, ImagesService],
})
export class AppModule {}
