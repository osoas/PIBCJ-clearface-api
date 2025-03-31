import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { EntityAlreadyExistsError } from 'src/shared/errors/EntityAlreadyExistsError.error';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ImagesService {
    constructor(private prisma:PrismaService){}


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
    
}
