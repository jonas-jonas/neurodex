import { User } from "../contexts/auth";

export type Model = {
	name: string;
	id: string;
	user?: User;
	created: string;
	updated: string;
};
