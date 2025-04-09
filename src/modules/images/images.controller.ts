import { Controller, Post, Get, Param, Body, Res, UseInterceptors, UploadedFile, Patch, Req } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { z } from 'zod';
import { refImage } from 'src/types/interfaces/refImage';



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

    @Patch('buffers/:appointmentId')
    async getImageBuffersByAppointment(@Req() req:Request, @Res() res:Response) {
        const { parseList } = z.object({
            parseList: z.array(z.object({
                id: z.union([z.string(), z.number()], {
                    message: "Payload inválido: id deve ser string ou number"
                }),
                appointmentId: z.string({
                    message: "Payload inválido: appointmentId deve ser string"
                }),
                url: z.string({
                    message: "Payload inválido: url deve ser string"
                }),
                type: z.enum(["detected", "uploaded"], {
                    message: "Payload inválido: type deve ser detected ou uploaded"
                })
            }))
        }).parse(req.body);


        const imageList = parseList as refImage[];
        try {
            const result = await this.ImageService.getImagesBuffers(imageList);
            
            // Transforma buffers em base64 e monta data URL
            const base64Images = result.map((buffer: Buffer) => {
                const base64 = buffer.toString('base64');
                return `data:image/png;base64,${base64}`; // ou image/jpeg, dependendo do seu formato
            });

            res.status(200).json(base64Images);
        } catch (error) {
            res.status(500).json({ message: "Erro ao processar as imagens", error: error.message });
        }
    }
}