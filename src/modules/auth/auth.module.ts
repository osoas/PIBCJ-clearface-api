import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'src/shared/lib/env';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtEstrategy.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
          secret: JWT_SECRET, // ⚠️ Ideal usar variáveis de ambiente para produção
          signOptions: { expiresIn: '1d' },
        }),
      ],
    providers: [AuthService,JwtStrategy,JwtService],
    
})
export class AuthModule {}
