
import { User } from "./user";

export interface Item {

    id: string,
    title: string,
    description: string,
    state: string,
    type: string,
    estimation: number,
    createdAt: string,
    createdBy: User,
    teamName: string,
    assignedTo: User

}
