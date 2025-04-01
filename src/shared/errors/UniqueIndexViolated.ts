export class UniqueIndexViolatedError extends Error{
    constructor(CreateEntity:string, RelatedEntity:string){
        super(`Can't create ${CreateEntity} because there's already one of these assigned to ${RelatedEntity}`)
    }
}