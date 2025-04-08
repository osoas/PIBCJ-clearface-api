import { Injectable } from '@nestjs/common';
import { Appointment, Image, Prisma } from '@prisma/client';
import { log } from 'console';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { UniqueIndexViolatedError } from 'src/shared/errors/UniqueIndexViolated';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ImagesService } from '../images/images.service';
import { ExpectedAppointmentResult } from 'src/types/interfaces/expectedAppointmentResult';
import { InputJsonValue } from '@prisma/client/runtime/library';

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
    async addAppointmentResult(appointment_id: string, resultado: ExpectedAppointmentResult) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointment_id },
        });
    
        if (!appointment) {
            throw new EntityDoesNotExists("Appointment", appointment_id);
        }
    
        const current = appointment.resultado ?? [];
    
        if (!Array.isArray(current)) {
            throw new Error("Campo 'resultado' não é uma lista válida");
        }
    
        const newList = [...(current as unknown as ExpectedAppointmentResult[]), resultado];
    
        const updated = await this.prisma.appointment.update({
            where: { id: appointment_id },
            data: {
                resultado: JSON.parse(JSON.stringify(newList)), // garante serialização válida
                updated_at:new Date()
            },
            select:{
                id:true,
                resultado:true,
                created_at:true,
                updated_at:true,
                user_id:false
            }
        });
    
        return updated;
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
