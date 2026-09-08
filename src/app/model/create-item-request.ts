export interface CreateItemRequest {

    title: string,
    description: string,
    estimation: number,
    type: string,
    state: string,
    createdBy: string,
    assignedTo: string,
    boardId: string

}
