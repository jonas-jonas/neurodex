export type User = {
	id: string;
	username: string;
	// password: string;
	admin: boolean;
}

export type Model = {
	id: string;
	name: string;
	user: User;
	createdAt: string;
	updatedAt: string;
	layers: ModelLayer[];
};

export type ModelLayer = {
	id: number;
	layerName: string;
	parameterData: Record<string, string>;
	layerType: LayerType;
}

export type ModelLayerParameterData = {
	modelLayer: ModelLayer;
	parameterName: string;
	value: string;
}

export type LayerType = {
	id: string;
	description: string;
	layerName: string;
	parameters: LayerParameter[];
}

export type LayerParameter = {
	name: string;
	type: string;
	defaultValue: string;
}
