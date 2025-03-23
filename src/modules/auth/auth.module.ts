import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_EXPIRES_IN, JWT_SECRET } from 'src/shared/lib/env';
import { AuthService } from './auth.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: JWT_SECRET,
          privateKey:JWT_SECRET,
          signOptions: { expiresIn: JWT_EXPIRES_IN,},
        }),
      ],
    providers: [AuthService],
    exports: [AuthService,JwtModule],
    
})
export class AuthModule {}
