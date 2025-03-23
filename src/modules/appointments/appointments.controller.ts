import { Controller, Post, Get, Param, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { z } from 'zod';
import { Response, Request } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { use } from 'passport';
import { AuthGuard } from '@nestjs/passport';

@Controller('consultas')
export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createAppointment(@Req() req: Request, @Res() res: Response) {
        const {id,username} = z.object({
            id:z.string({message:"Payload invalido"}).uuid("payload invalido: id nao é uuid"),
            username:z.string({message:"Payload invalido"}).min(3,"Payload invalido: username deve ter no mínimo 3 caracteres")
        }).parse(req.user);

        try {
            const appointment = await this.appointmentsService.create({ user_id:id, resultado:null });
            res.status(201).json(appointment);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async findAppointmentsByUser(@Req() req: Request, @Res() res: Response) {
        const {id} = z.object({
            id:z.string({message:"Payload invalido"}).uuid("payload invalido: id nao é uuid")}
        ).parse(req.user);
        try {
            const appointments = await this.appointmentsService.findManyByUser(id);
            res.status(200).json(appointments);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    @Get(':id')
    async findAppointmentById(@Param('id') id: string, @Res() res: Response) {
        try {
            const appointment = await this.appointmentsService.findUnique(id);
            res.status(200).json(appointment);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}