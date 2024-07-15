export interface Message {
    conversationId: string;
    senderId: string;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Read {
    receiverId: string;
    conversationId: string;
    senderId: string;
}