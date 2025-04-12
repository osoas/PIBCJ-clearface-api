import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { error, log } from "console";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { PythonFileRunningError } from "src/shared/errors/PythonFileRunninError";
import { promisify } from "util";


@Injectable()
export class DetectionServices{
    private outputPath = join(__dirname,"../../../detections")
    private sourcePath = join(__dirname,"../../../")
    private detectionMethodPath = join(__dirname,"../../../public/detection.py")
    constructor(){
        //log(this.detectionMethodPath)
    }

    async solveAppointment(imagePath: string, appointmentId:string): Promise<string | null> {
        
        const command = `python3 ${this.detectionMethodPath} ${imagePath} ${appointmentId}`;
        log(`Executing command: ${command}`);

        try {
            const execPromise = promisify(exec);
            const { stdout, stderr } = await execPromise(command);

            if (stderr) {
                throw new Error(`Python Error: ${stderr}`);
            }

            return stdout.trim(); // Retorna o output sem espaços extras
        } catch (error) {
            log(`Execution failed: ${error.message}`);
            return null;
        }
    }
    

    async loadResult(detectionResultFolder:string,pageFolder:string){
        const resultFolder = this.sourcePath+pageFolder
        log(`Result Folder: ${resultFolder}`);

        const jsonFilePath = join(resultFolder, 'result.json'); 
        if (!existsSync(jsonFilePath)) {
            throw new Error(`Arquivo JSON não encontrado em: ${jsonFilePath}`);
        }

        let fileContent = readFileSync(jsonFilePath, 'utf-8').trim();

        // Tenta encontrar o início do JSON
        const firstJsonIndex = fileContent.indexOf('{');
        if (firstJsonIndex !== -1) {
            fileContent = fileContent.substring(firstJsonIndex);
        }

        try {
            return JSON.parse(fileContent);
        } catch (error) {
            throw new Error(`Erro ao interpretar JSON: ${error.message}`);
        }
    }

    async loadImageBufferResult(detectionResultFolder:string){
        const imageFilePath = join(this.sourcePath, detectionResultFolder);
        log(`Image Path Folder: ${imageFilePath}`);

        
        if (!existsSync(imageFilePath)) {
            try {
                return readFileSync(this.sourcePath+"public/notFoundImage.png")
            } catch (error) {
                throw new Error(`Imagem Padrão Não encontrada: ${error.message}`);
            }
            
        }else{
            try {
                return readFileSync(imageFilePath);
            } catch (error) {
                throw new Error(`Erro ao ler arquivo de imagem: ${error.message}`);
            }
        }
    }
}   