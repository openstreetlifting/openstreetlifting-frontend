import { apiClient } from '../client';
import type { Competition, CompetitionDetail, CompetitionFilters } from '$lib/types/competition';

export const competitionsService = {
	/**
	 * Get all competitions with optional filters
	 */
	async getAll(filters?: CompetitionFilters): Promise<Competition[]> {
		return apiClient.get<Competition[]>('/api/competitions/detailed', {
			params: filters as Record<string, string | number | boolean>
		});
	},

	/**
	 * Get a single competition by ID or slug with full details including groups, participants, and lifts
	 */
	async getById(id: string): Promise<CompetitionDetail> {
		return apiClient.get<CompetitionDetail>(`/api/competitions/${id}/detailed`);
	}
};
