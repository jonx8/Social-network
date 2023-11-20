export interface UserInfo {
    id: number,
    username: string,
    email: string,
    status: string,
    fullName: string,
    birthDate: string,
    avatar: string,
    isAdmin: boolean,
    friends_id: Array<number>
}
