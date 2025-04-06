import { Controller, Post, Get, Param, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { z } from 'zod';
import { Response, Request } from 'express';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { use } from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { UniqueIndexViolatedError } from 'src/shared/errors/UniqueIndexViolated';
import { DetectionServices } from './detections.service';
import { PythonFileRunningError } from 'src/shared/errors/PythonFileRunninError';
import { detectionPrefabJson } from 'src/types/interfaces/jsonResponseType';
import { ImagesService } from '../images/images.service';
import { randomUUID } from 'crypto';
import { ExpectedAppointmentResult } from 'src/types/interfaces/expectedAppointmentResult';

@Controller('consultas')
export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService,private detectionService:DetectionServices,private ImageService:ImagesService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createAppointment(@Req() req: Request, @Res() res: Response) {
        
        
        const {id,username} = z.object({
            id:z.string({message:"Payload invalido"}).uuid("payload invalido: id nao é uuid"),
            username:z.string({message:"Payload invalido"}).min(3,"Payload invalido: username deve ter no mínimo 3 caracteres"),
            
        }).parse(req.user);

        const {image_id} = z.object({
            image_id:z.string({message:'Need to provide a image_id'}).cuid("image_id invalido (cuid)")
        }).parse(req.body);

        try {
            
            const image = await this.ImageService.returnByImageId(image_id)

            log(`created appointment, displayed at: ${image.url}`)

            //Detect
            const JSONResponse = await this.detectionService.solveAppointment(image.url,image.id)
            // log(JSONResponse)
            // const toJson:detectionPrefabJson = JSON.parse(JSONResponse)
            
            // log(toJson.created_folder)

            //Load Detect Result
            const detectionResult = await this.detectionService.loadResult(image.id)
            log(detectionResult)

            const result = await this.appointmentsService.create({ image_id,user_id:id, resultado:detectionResult });
            
            res.status(201).json(result.CreatedAppointment);
        } catch (err) {
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message });
            }else if(err instanceof PrismaClientUnknownRequestError){
                res.status(404).json({ message: "PrismaError" });
            }else if(err instanceof UniqueIndexViolatedError){
                res.status(401).send({Description:"Chave unica violada",message:err.message})
            }else if(err instanceof PythonFileRunningError){
                res.status(500).send({DescriptioN:"Erro ao rodar detecção python",message:err.message})
            } else {
                res.status(500).json({ message: "Internal server error",err:err.message });
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

    @Get(':id/imagem')
    async findAppointmentResultImage(@Req() req:Request, @Res() res: Response) {
        const {id} = z.object({
            id:z.string({message:"Payload invalido"}).cuid("payload invalido: id nao é uuid")}
        ).parse(req.params);

        try{
            const appointment = await this.appointmentsService.findUnique(id);
            const {
                image,
                iga_score,
                image_path,
                acne_quantity,
                detected_classes
              } = appointment.resultado as unknown as ExpectedAppointmentResult;
            
            const imageBuffer = await this.detectionService.loadImageBufferResult(image_path)
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `attachment; filename=resultimage.jpg`);
            res.status(200).send(imageBuffer);
        }catch(err){
            if (err instanceof EntityDoesNotExists) {
                res.status(404).json({ message: err.message, description: "Imagem não encontrada" });
            } else {
                res.status(500).json({ message: "Internal server error" , err:err.message});
            }
        }

    }   
}