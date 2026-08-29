import { pb } from '$lib';
import type { DocumentsResponse } from '$lib/pocketbase-types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (e) => {
	if (!e.data.token) return { docs: [], token: "" }
	
	if (!pb.authStore.isValid) {
		return { docs: [], token: e.data.token };
	}

	const docs = await pb.collection('documents').getFullList<DocumentsResponse>({
		sort: '-docTime',
	});

	return { docs, token: e.data.token };
};

export const ssr = false;