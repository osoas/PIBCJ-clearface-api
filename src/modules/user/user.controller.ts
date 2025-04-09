import { Controller, Post, Get, Put, Req, Res, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { z } from 'zod';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { ValidationError } from 'src/shared/errors/ValidationError.erro';
import { Request, response, Response } from 'express';
import { EntityAlreadyExistsError } from 'src/shared/errors/EntityAlreadyExistsError.error';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class UserController {
    
    constructor(private UserService: UserService,private authService: AuthService) {}

    @Post("register")
    async registerUser(@Req() req: Request, @Res() res: Response) {
        const { email, name, password } = z.object({
            email: z.string().email("Por favor informe um email válido"),
            password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
            name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres")
        }).parse(req.body);

        try {
            const response = await this.UserService.create({ email, name, password });
            res.status(201).json(response);
        } catch (err) {
            if (err instanceof EntityAlreadyExistsError) {
                res.status(409).json({ message: err.message, description: "User already exists" });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async returnProfile(@Req() req:Request, @Res() res: Response) {
        const {id,username} = z.object({
            id:z.string({message:"Payload invalido"}).uuid("payload invalido: id nao é uuid"),
            username:z.string({message:"Payload invalido"}).min(3,"Payload invalido: username deve ter no mínimo 3 caracteres")
        }).parse(req.user);
        console.log({id,username})
        try {
            const profile = await this.UserService.returnProfile(id);

            res.status(200).json({
                Description: "User profile returned successfully",
                profile
            });
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    @Post("login")
    async returnIdAfterLogin(@Body() body: any, @Res() res: Response) {
        const { email, password } = z.object({
            email: z.string().email("Por favor informe um email válido"),
            password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
        }).parse(body);

        try {
            // console.log(email+password)
            const response = await this.UserService.returnIdAfterLogin(email, password);

            console.log(response)

            const token = await this.authService.generateToken({id:response.id,name:response.name});
            console.log(token)
            //Should generate the funcking token here;
            res.status(200).json({
                Description: "User logged in successfully",
                token: token
            });

        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ Description:"Entity Not Found Error",message: err.message });
            }else if(err instanceof ValidationError){
                res.status(401).json({ Description:"Invalid password",message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    }

    @Put("password")
    async updatePasswordByRecCode(@Req() req: Request, @Res() res: Response) {
        const { refCode, newPassword,passInfo} = z.object({
            refCode: z.string({message:"Voce precisa fornecer uma string com o código"}),
            newPassword: z.string({message:"Voce precisa fornecer uma nova senha"}).min(6, "A senha deve ter no mínimo 6 caracteres"),
            passInfo:z.string({message:"Voce precisa fornecer uma string com o código"})
        }).parse(req.body);

        // const recString = req.cookies["pass_info"]
        //console.log(refCode)
        
        try {
            await this.UserService.updatePasswordByRecCode(passInfo, newPassword, refCode);
            res.status(200).json({ message: "Password updated successfully" });
        } catch (err) {
            if (err instanceof EntityDoesNotExists || err instanceof ValidationError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error",err:err.message });
            }
        }
    }

    @Post("recover")
    async sendRecoveryCode(@Body() body: any, @Res() res: Response) {
        const { email } = z.object({
            email: z.string().email("Por favor informe um email válido")
        }).parse(body);

        try {
            const {Code,Email} = await this.UserService.sendRecoveryCode(email);
            
            res.cookie("pass_info",`${Email}-${Code}`)

            res.status(200).json({ Description:"Successfully sent email"});

        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error", err:err.message});
            }
        }
    }
}