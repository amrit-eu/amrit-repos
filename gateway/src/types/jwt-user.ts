import {Socket} from 'socket.io'

export interface JwtUser {
	userId: string; // ← string because contactId from payload is a string
	username: string;
	name: string;
	roles: string[]
}

export type authentifiedSocket = Socket & {user : JwtUser}