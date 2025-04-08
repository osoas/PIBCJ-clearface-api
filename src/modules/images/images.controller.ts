import { Controller, Post, Get, Param, Body, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { z } from 'zod';



@Controller('images')
export class ImagesController {
    constructor(private ImageService: ImagesService) {}

    @UseInterceptors(FileInterceptor('FaceImage',{
        fileFilter: (req, file, cb) => {
            console.log(file)
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
            }
            cb(null, true);
        },
        storage:diskStorage({
                            destination: './uploads', // Diretório onde as imagens serão salvas
                            filename: (req, file, cb) => {
                                const uniqueSuffix = `${Date.now()}`;
                                cb(null, `${uniqueSuffix}.png`); // Salvando como PNG
                            },
                        }),
    })) 
    @Post()
    async createImage(@UploadedFile() file:Express.Multer.File, @Body() body: any, @Res() res: Response) {
        const { appointment_id } = z.object({
            appointment_id: z.string({ message: 'Payload inválido' }).cuid('Payload inválido: id não é uuid'),

        }).parse(body)
        
        if (!file) {
            console.log(file)
            return res.status(400).json({ message: 'Nenhuma imagem enviada!' });
        }
        
        const filePath = join(__dirname+"../../../../",file.destination+"/"+file.filename)

        try {

            // Salvando no banco de dados
            const image = await this.ImageService.create({ url: filePath,appointmentId: appointment_id });

            console.log('Imagem armazenada em: \x1b[32', filePath,"\x1b[0");
            return res.status(201).json({ Description: 'Upload concluído com sucesso', image, body });

        } catch (err) {
            console.error('Erro ao processar a imagem:', err);
            return res.status(500).json({ message: err.message });
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