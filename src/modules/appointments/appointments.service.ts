import { Injectable } from '@nestjs/common';
import { Appointment, Image, Prisma } from '@prisma/client';
import { log } from 'console';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { UniqueIndexViolatedError } from 'src/shared/errors/UniqueIndexViolated';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ImagesService } from '../images/images.service';

interface unloadInfo{
    CreatedAppointment:{
        id:string,
        created_at:Date
    },
    ReferedImages:Image[]
}
@Injectable()
export class AppointmentsService {

    constructor(private prisma:PrismaService){}

    async create(data:Prisma.AppointmentUncheckedCreateInput):Promise<unloadInfo> {
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                id:data.user_id
            }
        })
        if(!doesTheUserExists){
            throw new EntityDoesNotExists("User",data.user_id)
        }
        

        const appointment = await this.prisma.appointment.create({
            data,
            select:{
                id:true,
                created_at:true,
                resultado:true
            }
        });

        const ReferedImages = await this.prisma.image.findMany({
            where:{
                appointmentId:appointment.id
            }
        })
        

        return {
            CreatedAppointment:appointment,
            ReferedImages,
        };
    }

    async findManyByUser(user_id:string) {
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                id:user_id
            }
        })
        if(!doesTheUserExists){
            throw new EntityDoesNotExists("User",user_id)
        }
        return await this.prisma.appointment.findMany({
            where:{
                user_id
            },
            select:{
                id:true,
                user_id:false,
                resultado:true,
                created_at:true
            }
        });
    }

    async findUnique(id:string){
        const appointment = await this.prisma.appointment.findUnique({
            where:{
                id
            },
            select:{
                id:true,
                user_id:false,
                resultado:true,
                created_at:true
            }
        });
        if(!appointment){
            throw new EntityDoesNotExists("Appointment",id)
        }
        return appointment;
    }
}
