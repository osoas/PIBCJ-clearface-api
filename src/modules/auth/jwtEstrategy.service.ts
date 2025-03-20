import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'minha_chave_secreta', // ⚠️ Use variáveis de ambiente para produção
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}
