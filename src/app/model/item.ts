
import { User } from "./user";
import { ItemState } from "./wip-limit";

export interface Item {

    id: string,
    title: string,
    description: string,
    state: ItemState,
    type: string,
    estimation: number,
    createdAt: string,
    createdBy: User,
    assignedTo: User,
    boardId: string

}
