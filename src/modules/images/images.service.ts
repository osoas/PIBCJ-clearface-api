import { Inject, Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { log } from 'console';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { EntityAlreadyExistsError } from 'src/shared/errors/EntityAlreadyExistsError.error';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { refImage } from 'src/types/interfaces/refImage';

@Injectable()
export class ImagesService {
    constructor(private prisma:PrismaService){}
    private outputPath = join(__dirname,"../../../detections")
    private sourcePath = join(__dirname,"../../../")
    private detectionMethodPath = join(__dirname,"../../../public/detection.py")

    async create(data:Prisma.ImageUncheckedCreateInput){
        return await this.prisma.image.create({
            data
        })
    }

    async returnByAppointmentId(appointment_id:string){

        const doesTheAppointmentExists = await this.prisma.appointment.findUnique({
            where:{
                id:appointment_id
            }
        })

        if(!doesTheAppointmentExists){
            throw new EntityDoesNotExists("appointment",appointment_id)
        }
   
        return doesTheAppointmentExists
    }
    async returnByImageId(ImageId:string):Promise<Image>{
        const Image = await this.prisma.image.findUnique({
            where:{
                id:ImageId
            }
        })
        if(!Image){
            throw new EntityDoesNotExists("Image",ImageId)
        }

        return Image
    }

    async getImagesBuffers(images:refImage[]):Promise<Buffer[]>{
        return await Promise.all(images.map((image, index) => {
                
                const imageFilePath = image.url
                log(`Image Path Folder: ${imageFilePath}`);
                log(`Image at ${index} is ${image}`)
                
                if (!existsSync(imageFilePath)) {
                    // throw new Error(`Arquivo de imagem não encontrado em: ${imageFilePath}`);
                }

                try {
                    return readFileSync(imageFilePath);
                } catch (error) {
                    throw new Error(`Erro ao ler arquivo de imagem: ${error.message}`);
                }
            })
        )
    }
    
}
