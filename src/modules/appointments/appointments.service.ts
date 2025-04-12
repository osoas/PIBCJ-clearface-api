import { Injectable } from '@nestjs/common';
import { Appointment, Image, Prisma } from '@prisma/client';
import { log } from 'console';
import { EntityDoesNotExists } from 'src/shared/errors/EntittyDoesNotExists.error';
import { UniqueIndexViolatedError } from 'src/shared/errors/UniqueIndexViolated';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ImagesService } from '../images/images.service';
import { ExpectedAppointmentResult } from 'src/types/interfaces/expectedAppointmentResult';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { refImage, refImageType } from 'src/types/interfaces/refImage';
import { interleaveByParity } from 'src/shared/utils/interlayByParity';
import { DetectionServices } from './detections.service';

interface unloadInfo{
    CreatedAppointment:{
        id:string,
        created_at:Date
    },
    ReferedImages:Image[]
}
interface appointmentReturnAsList{
    appointment:Partial<Appointment>,
    imageClassList:refImage[]
}
@Injectable()
export class AppointmentsService {

    constructor(private prisma:PrismaService, private detectService:DetectionServices,private imageService:ImagesService){}

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




        const manyResult = await this.prisma.appointment.findMany({
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

        // Organiza os dados no formato desejado
        const formatted = manyResult.flatMap((appointment) =>
            appointment.resultado.map((resultItem) => {
                const res = resultItem as unknown as ExpectedAppointmentResult;
                return{
                    day: appointment.created_at,
                    value: res.iga_score
                }

            })
          );

        return {
            appointments: formatted,
            manyResult:manyResult,
            count: manyResult.length
        };

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


    async findUnique(id:string):Promise<appointmentReturnAsList> {
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
        var getImageListedToAppointment = await this.prisma.image.findMany({
            where:{
                appointmentId:id
            },
            select:{
                id:true,
                created_at:false,
                updated_at:false,
                appointmentId:false,

                url:true
            }
        })
        
        const selList = await Promise.all(getImageListedToAppointment.map(async(item)=>{
            const {id,url} = item
            const ImageBuffer = await this.imageService.getImagesBuffers([{
                url,id,type:refImageType.uploaded,appointmentId:appointment.id,imageBase:undefined
            }])
            return {
                id,url,
                appointmentId:appointment.id,
                type:refImageType.uploaded,
                imageBase:`data:image/png;base64,${ImageBuffer[0].toString('base64')}`
            }
        })) as refImage[]
        
        
        const getResultImagesFromApppointment:refImage[] = await 
        Promise.all(
            appointment.resultado?.map(async(item:unknown,id:number) => {
                const parsedItem = item as ExpectedAppointmentResult;
                const loadFile = await this.detectService.loadImageBufferResult(parsedItem.image_path)
                return {
                    id,
                    appointmentId: appointment.id,
                    url: parsedItem.image_path,
                    type:refImageType.detected,
                    imageBase:`data:image/png;base64,${loadFile.toString('base64')}`
                }
            })
        )

        return {
            appointment,
            imageClassList:interleaveByParity(selList,getResultImagesFromApppointment)
        };
    }
}

