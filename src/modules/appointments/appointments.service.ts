import { Injectable } from '@nestjs/common';
import { Appointment, Image, Prisma } from '@prisma/client';
import { log } from 'console';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { UniqueIndexViolatedError } from 'src/shared/errors/UniqueIndexViolated';
import { PrismaService } from 'src/shared/prisma/prisma.service';

interface unloadInfo{
    CreatedAppointment:{
        id:string,
        created_at:Date
    },
    ReferedImage:Image
}
@Injectable()
export class AppointmentsService {

    constructor(private prisma:PrismaService){}

    async create(data:Prisma.AppointmentUncheckedCreateInput):Promise<unloadInfo> {
        const doesTheImageExist = await this.prisma.image.findUnique({
            where:{
                id:data.image_id
            }
        })
        if(!doesTheImageExist){
            throw new EntityDoesNotExists("Image",data.user_id)
        }
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                id:data.user_id
            }
        })
        if(!doesTheUserExists){
            throw new EntityDoesNotExists("User",data.user_id)
        }
        
        const TheresAlreadyAnAppointmentForThisImage = await this.prisma.appointment.findMany({
            where:{
                image_id:data.image_id
            }
        })
        if(TheresAlreadyAnAppointmentForThisImage[0]){
            throw new UniqueIndexViolatedError("Appointment","Image")
        }

        const appointment = await this.prisma.appointment.create({
            data,
            select:{
                id:true,
                created_at:true,
                resultado:true
            }
        });

        

        return {
            CreatedAppointment:appointment,
            ReferedImage:doesTheImageExist
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
