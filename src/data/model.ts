import { User } from "../contexts/auth";

export type Model = {
	name: string;
	id: string;
	user?: User;
	createdAt: string;
	updatedAt: string;
};
