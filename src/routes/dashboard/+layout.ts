import { pb } from '$lib';
import type { DocumentsResponse } from '$lib/pocketbase-types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	if (!data.token) return { docs: [], token: "" }
	
	if (!pb.authStore.isValid) {
		return { docs: [], token: data.token };
	}

	const docs = await pb.collection('documents').getFullList<DocumentsResponse>({
		sort: '-docTime',
		fetch: fetch
	});

	return { docs, token: data.token };
};
