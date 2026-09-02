export interface LoginResponse {
    jwt: string,
    userName: string,
    email: string
    authorities: string[]
}
