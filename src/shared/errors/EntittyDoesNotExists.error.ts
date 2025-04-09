/**
 * Classe de exceção personalizada para lidar com erros de entidade inexistente.
 * Esta exceção é lançada quando uma entidade esperada não é encontrada no sistema.
 */
export class EntityDoesNotExists extends Error {
    /**
     * Cria uma instância de EntityDoesNotExists.
     * 
     * @param entityName - Nome da entidade que não foi encontrada.
     * @param value - Identificador ou valor usado na tentativa de localizar a entidade.
     */
    constructor(entityName: string, value: string) {
        super(`Entity ${entityName} with ${value} does not exist`);
        this.name = 'EntityDoesNotExists';
    }
}

