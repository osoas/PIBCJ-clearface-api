import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface user{id:string,name:string}
@Injectable()
export class AuthService {
  constructor(private jwtservice: JwtService) {
    // console.log("jwtservice:", this.jwtservice);
  }

  async generateToken({id,name}:user): Promise<string> {
    const payload = { username: name, sub:id };
    console.log(payload)
    return this.jwtservice.sign(payload);
  }

  async validateUser(payload: any): Promise<user> {
    // Aqui você pode implementar a lógica de validação do usuário
    return { id: payload.sub, name: payload.username };
  }
}
