export enum refImageType {
    detected="detected",
    uploaded="uploaded"
}

export interface refImage{
    id:string | number,
    appointmentId:string,
    url:string,
    type:refImageType,
    imageBase:string | undefined
}