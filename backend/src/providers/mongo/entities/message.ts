export interface Message {
	senderId: string;
	receiverId: string;
	content: string;
	sendAt: Date;
	readAt: Date | null;
}
