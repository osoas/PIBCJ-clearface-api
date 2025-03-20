import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { z } from 'zod';
import { Response } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';

@Controller('consultas')
export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService) {}

    @Post()
    async createAppointment(@Body() body: any, @Res() res: Response) {
        const { user_id, resultado } = z.object({
            user_id: z.string(),
            resultado: z.any(), // Accepts any valid JSON
        }).parse(body);

        try {
            const appointment = await this.appointmentsService.create({ user_id, resultado });
            res.status(201).json(appointment);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    //Mudar isso aqui depois para implementar a autenticação
    @Get('user/:user_id')
    async findAppointmentsByUser(@Param('user_id') user_id: string, @Res() res: Response) {
        try {
            const appointments = await this.appointmentsService.findManyByUser(user_id);
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