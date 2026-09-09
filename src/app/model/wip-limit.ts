export type ItemState = "TO_DO" | "READY" | "IN_PROGRESS" | "DONE" | "IN_PROGRESS" | "CODE_REVIEW" | "IN_TEST" | "READY_FOR_PROD" | "DONE"
export interface WipLimit {

    id: string,
    teamId: string,
    state: ItemState,
    maxItems: number

}
