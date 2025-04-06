interface AcneQuantity {
    "Nódulos": number;
    "Pápulas": number;
    "Pústulas": number;
    "Cravos Pretos": number;
    "Cravos Brancos": number;
    "Manchas Escuras": number;
  }
  
export interface ExpectedAppointmentResult {
    image: string;
    iga_score: number;
    image_path: string;
    acne_quantity: AcneQuantity;
    detected_classes: number[];
  }