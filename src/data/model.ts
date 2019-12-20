import { User } from "../contexts/auth";

export type Model = {
	name: string;
	id: string;
	user?: User;
	createdAt: string;
	updatedAt: string;
	layers: Layer[];
};

export type Layer = {
	type: LayerType;
	data: object;
}

export type LayerType = {
	displayName: string;
	description: String;
	params: LayerParam[];
}

export type LayerParam = {
	name: string;
	type: string;
}