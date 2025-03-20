import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ImagesService {
    constructor(private prisma:PrismaService){}


    async create(data:Prisma.ImageUncheckedCreateInput){
        const doesTheAppointmentExists = await this.prisma.appointment.findUnique({
            where:{
                id:data.appointment_id
            }
        })

        if(!doesTheAppointmentExists){
            throw new EntityDoesNotExists("appointment",data.appointment_id)
        }

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
