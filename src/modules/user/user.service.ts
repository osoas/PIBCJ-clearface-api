import { CacheInterceptor } from '@nestjs/cache-manager';
import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { Cache } from 'cache-manager';
import e from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { EntityAlreadyExistsError } from 'src/shared/errors/EntityAlreadyExistsError.error';
import { ValidationError } from 'src/shared/errors/ValidationError.erro';
import { ADMIN_EMAIL } from 'src/shared/lib/env';
import { SendEmail } from 'src/shared/lib/nodemailer';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GenValidationCode } from 'src/shared/utils/genValidCode';
import { splitStringAtDash } from 'src/shared/utils/SeparateCookieString';
import { EmailType } from 'src/types/interfaces/emailType';

interface returnCookieInformation{
    Email:string,
    Code:string
}
interface restrictUser{
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class UserService {

    constructor(
        @Inject('CACHE_MANAGER') private cacheManager:Cache, //Injeta o cache manager
        private prisma:PrismaService
    ) {}

    async create(data:Prisma.UserCreateInput):Promise<restrictUser> {
        const doesTheUserAlreadyExist = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if(doesTheUserAlreadyExist) {
            throw new EntityAlreadyExistsError('User',data.email);
        }
        const {email,name,password,appointments,created_at} = data;

        const _password = await hash(password,9); //hashing the password
        const _data:Prisma.UserCreateInput = {email,name,password:_password,appointments,created_at}
        const newUser = await this.prisma.user.create({data:_data});
        await this.cacheManager.set(`profile:${newUser.id}`, newUser);
        return {
            created_at:newUser.created_at,email,name,updated_at:newUser.updated_at
        }
    }
    async returnProfile(id:string):Promise<restrictUser>{
        //Checa se o profile está guardado em cache e se estiver retorna o perfil que já está em cache ao invés de carregar novamente o mesmo perfil
        const cacheProfile = await this.cacheManager.get<User>(`profile:${id}`) as User
        
        var user:User
        if(cacheProfile){
            if(cacheProfile.id == id ){
                const {created_at,email,name,updated_at} = cacheProfile

                return {created_at,email,name,updated_at}
            }
            user = await this.prisma.user.findUnique({
                where:{
                    id
                }
            })
        }else{
            user = await this.prisma.user.findUnique({
                where:{
                    id
                }
            })
        }

        if(!user){
            throw new EntityDoesNotExists('User',id);
        }

        const {created_at,email,name,updated_at} = user

        await this.cacheManager.set(`profile:${id}`, user);

        return {created_at,email,name,updated_at}
    }

    async returnIdAfterLogin(email:string,password:string){
        const user = await this.prisma.user.findUnique({
            where:{
                email
            },
            select:{
                name:true,
                id:true,
                password:true,
            }
        })
        if(!user){
            throw new EntityDoesNotExists('User',email);
        }
        const passwordMatch = await compare(password,user.password);
        if(!passwordMatch){
            throw new ValidationError('Invalid password');
        }
        
        await this.cacheManager.set(`profile:${user.id}`,user)
        return {id:user.id,name:user.name}
    }
    async updatePasswordByRecCode(recString:string,newPassword:string,refCode:string):Promise<restrictUser>{
        const [email,ValCode] = splitStringAtDash(recString)
        var user:User
        const cacheUser = await this.cacheManager.get("userEmail") as User
        if(cacheUser){
            if(cacheUser.email==email){
                user = cacheUser
            }
        }else{
            user = await this.prisma.user.findUnique({
                where:{
                    email
                }
            })
        }

        if(!user){
            throw new EntityDoesNotExists('User',email);
        }

        if(refCode !== ValCode){
            throw new ValidationError('Invalid code');
        }

        //Atualizando a senha
        const updateUser = await this.prisma.user.update({
            where:{
                email:email
            },
            data:{
                password:await hash(newPassword,9)
            }
        })
        const {created_at,name,updated_at} = updateUser
        
        await this.cacheManager.set("userEmail",{created_at,email,name,updated_at})
        return {created_at,email,name,updated_at} 
    }
    async sendRecoveryCode(email:string):Promise<returnCookieInformation>{
        const user = await this.prisma.user.findUnique({
            where:{
                email
            },
            select:{
                id:true,
                password:true,
                name:true
            }
        })
        if(!user){
            throw new EntityDoesNotExists('User',email);
        }
        const code = GenValidationCode()
        const _email:EmailType = {
            to:email,
            subject:"No-Reply Email de recuperação de senha",
            text:`  Assunto: Recuperação de Senha

                    Olá, ${user.name}

                    Recebemos uma solicitação para redefinir a sua senha.

                    Para continuar, utilize o código abaixo:

                    ${code}

                    Se você não solicitou essa alteração, ignore este e-mail. O código expirará em breve por motivos de segurança.

                    Atenciosamente,
                    Equipe de suporte.
                    Dúvidas? Entre em contato: ${ADMIN_EMAIL}
                `
        }

        
        const a = await SendEmail(_email);
        console.log(a);
        return {Code:code,Email:email} //Retornando o email e o código de validação no formato email-codigo
    }

}
