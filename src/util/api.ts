import ky from 'ky';

export const api = ky.extend({
	prefixUrl: '/api',
	hooks: {
		beforeRequest: [
			async (request, d) => {
				if (request.url.endsWith('/api/models')) {
					const response = new Response(JSON.stringify(dummyModels));
					return response;
				} else if (request.url.endsWith('/api/model/create')) {
					const response = new Response(JSON.stringify({ id: 'some-id' }));
					return response;
				}
			}
		]
	}
});

const dummyModels = [
	{
		name: 'Modelname',
		id: 'asd',
		created: new Date('December 17, 1995 03:24:00'),
		updated: new Date('December 17, 2018 03:24:00')
	},
	{
		name: 'Modelname',
		id: 'asd2',
		created: new Date('December 17, 1995 03:24:00'),
		updated: new Date('December 17, 2018 03:24:00')
	}
];
