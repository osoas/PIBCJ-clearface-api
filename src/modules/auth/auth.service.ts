import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface user{id:string,name:string}
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken({id,name}:user): Promise<string> {
    const payload = { username: name, sub:id };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any): Promise<any> {
    // Aqui você pode implementar a lógica de validação do usuário
    return { id: payload.sub, username: payload.username };
  }
}
