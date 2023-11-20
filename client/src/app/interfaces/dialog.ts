export interface Message {
    from: number,
    createdAt: string,
    text: string
}


export interface Dialog {
    id: number,
    participants: Array<number>,
    messages: Array<Message>,

}
