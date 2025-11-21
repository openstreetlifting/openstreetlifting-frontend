import { apiClient } from '../client';
import type { AthleteDetail } from '$lib/types/athlete';

export const athletesService = {
	/**
	 * Get a single athlete by slug with full details including competition history and personal records
	 */
	async getBySlug(slug: string): Promise<AthleteDetail> {
		return apiClient.get<AthleteDetail>(`/api/athletes/${slug}/detailed`);
	}
};
