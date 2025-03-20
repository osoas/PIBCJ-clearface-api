import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { z } from 'zod';
import { Response } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';

@Controller('images')
export class ImagesController {
    constructor(private ImageService: ImagesService) {}

    @Post()
    async createImage(@Body() body: any, @Res() res: Response) {
        const { appointment_id, url } = z.object({
            appointment_id: z.string(),
            url: z.string().url("Por favor informe uma URL válida"),
        }).parse(body);

        try {
            const image = await this.ImageService.create({ appointment_id, url });
            res.status(201).json(image);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    @Get('appointment/:appointment_id')
    async returnImagesByAppointmentId(@Param('appointment_id') appointment_id: string, @Res() res: Response) {
        try {
            const images = await this.ImageService.returnByAppointmentId(appointment_id);
            res.status(200).json(images);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}