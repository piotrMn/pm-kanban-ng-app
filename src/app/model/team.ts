import { User } from "./user"

export interface Team {

    id: string
    name: string,
    createdBy: User,
    teamMembers: User[]
    
}
