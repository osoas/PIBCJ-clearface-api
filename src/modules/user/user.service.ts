import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
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

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}

    async create(data:Prisma.UserCreateInput) {
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

        return this.prisma.user.create({data:_data});
    }
    async returnProfile(id:string){
        const user = await this.prisma.user.findUnique({
            where:{
                id
            },
            select:{
                id:false,
                name:true,
                email:true,
                password:false,
                created_at:true,
                updated_at:true}
        })

        if(!user){
            throw new EntityDoesNotExists('User',id);
        }

        return user
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
        

        return {id:user.id,name:user.name}
    }
    async updatePasswordByRecCode(recString:string,newPassword:string,refCode:string){
        const [email,ValCode] = splitStringAtDash(recString)

        const user = await this.prisma.user.findUnique({
            where:{
                email
            },
            select:{
                id:true,
                password:true,
            }
        })
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
