export function extractJsonFromPythonOutput(output: string): any | null {
    const jsonMatch = output.match(/{[\s\S]*}$/);
  
    if (!jsonMatch) return null;
  
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Erro ao fazer parse do JSON:", err);
      return null;
    }
  }