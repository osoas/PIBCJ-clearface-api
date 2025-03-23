import { Controller, Post, Get, Param, Body, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import { z } from 'zod';
import { Response } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
    constructor(private ImageService: ImagesService) {}

    @UseInterceptors(FileInterceptor('FaceImage')) 
    @Post()
    async createImage(@UploadedFile() file:Express.Multer.File, @Body() body: any, @Res() res: Response) {
        const { appointment_id } = z.object({

            appointment_id: z.string({message:"appointment_id is required to be a string"}).cuid({message:"appointment_id is not a valid cuid"}),

        }).parse(body);

        const url = file.path; //scr do file após upload
        console.log("file stored URL:",url)

        try {
            const image = await this.ImageService.create({ appointment_id, url });
            
            console.log("image",image)

            res.status(201).json({Description:"Upload concluído com sucesso",image,body});

        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
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
                res.status(500).json({ message: err.message });
            }
        }
    }
}