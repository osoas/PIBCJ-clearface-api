/**
 * Classe de exceção personalizada para lidar com erros de duplicidade de entidade.
 * Esta exceção é lançada quando se tenta criar uma entidade que já existe no sistema.
 */
export class EntityAlreadyExistsError extends Error {
     /**
     * Cria uma instância de EntityAlreadyExistsException.
     * 
     * @param entityName - Nome da entidade onde ocorreu o erro.
     * @param value - Campo específico da entidade associado ao erro.
     * @example "Entity User with email@email.com already exists"
     */
    constructor(entityName: string, value: string) {
        super(`Entity ${entityName} with ${value} already exists`);
    }
}