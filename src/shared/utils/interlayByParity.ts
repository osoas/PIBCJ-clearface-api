import { resourceUsage } from "process";
import { refImage } from "src/types/interfaces/refImage";

export function interleaveByParity(list1: refImage[], list2: refImage[]): refImage[] {
    const result: refImage[] = [];
  
    // Separa pares e ímpares
    const evenList1 = list1.filter((_, i) => i % 2 === 0);
    const evenList2 = list2.filter((_, i) => i % 2 === 0);
    const oddList1 = list1.filter((_, i) => i % 2 !== 0);
    const oddList2 = list2.filter((_, i) => i % 2 !== 0);
  
    // Intercala pares
    const maxEvenLength = Math.max(evenList1.length, evenList2.length);
    for (let i = 0; i < maxEvenLength; i++) {
      if (evenList1[i]) result.push(evenList1[i]);
      if (evenList2[i]) result.push(evenList2[i]);
    }
    return result;
}