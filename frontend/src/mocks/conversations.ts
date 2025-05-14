import type { Conversation } from "@/schemas/conversationSchema";

export const conversations: Conversation[]
	= [
		{
			id: "b1e7c8a2-1f2d-4e3b-9a7c-1234567890ab",
			name: "Groupe Dev",
			messages: [
				{
					sender: "you",
					user: "Vous",
					content: "Salut l'équipe !",
					createdAt: new Date().toISOString(),
				},
				{
					sender: "them",
					user: "Alice",
					content: "Coucou !",
					createdAt: new Date().toISOString(),
				},
			],
			lastMessage: {
				sender: "them",
				user: "Alice",
				content: "Coucou !",
				createdAt: new Date().toISOString(),
			},
		},
		{
			id: "a2c9d7b3-2e4f-5c6d-8b9e-abcdef123456",
			name: "Alice",
			messages: [
				{
					sender: "you",
					user: "Vous",
					content: "Hello Alice",
					createdAt: new Date().toISOString(),
				},
				{
					sender: "them",
					user: "Alice",
					content: "Salut !",
					createdAt: new Date().toISOString(),
				},
			],
			lastMessage: {
				sender: "them",
				user: "Alice",
				content: "Salut !",
				createdAt: new Date().toISOString(),
			},
		},
		{
			id: "c3d8e9f4-3a5b-6d7e-9c0f-fedcba654321",
			name: "Bob",
			messages: [
				{
					sender: "you",
					user: "Vous",
					content: "Hey Bob",
					createdAt: new Date().toISOString(),
				},
				{
					sender: "them",
					user: "Bob",
					content: "Yo !",
					createdAt: new Date().toISOString(),
				},
			],
			lastMessage: {
				sender: "them",
				user: "Bob",
				content: "Yo !",
				createdAt: new Date().toISOString(),
			},
		},
	];
