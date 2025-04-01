
export class PythonFileRunningError extends Error {

   constructor(Reason:string) {
       super(`Error While Trying to run python detect file Reason: ${Reason}`);
   }
}