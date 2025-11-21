<script lang="ts">
	import type { PageData } from './$types';
	import { Card } from '$lib/components/ui';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
	const { competition } = data;

	function formatWeight(weight: string | null): string {
		if (!weight) return '-';
		return `${weight} kg`;
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{competition.name} - OpenStreetlifting</title>
	<meta name="description" content="Results and details for {competition.name}" />
</svelte:head>

<div class="mx-auto max-w-7xl px-6 py-12">
	<!-- Competition Header -->
	<div class="mb-12">
		<div class="mb-6">
			<a
				href={resolve('/competitions')}
				class="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				Back to competitions
			</a>
		</div>

		<h1 class="mb-4 text-5xl font-light text-white">{competition.name}</h1>

		<div class="flex flex-wrap gap-x-6 gap-y-3 text-base text-zinc-400">
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<span>
					{formatDate(competition.start_date)}
					{#if competition.start_date !== competition.end_date}
						- {formatDate(competition.end_date)}
					{/if}
				</span>
			</div>

			<div class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<span>{competition.venue}, {competition.city}, {competition.country}</span>
			</div>

			<div class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
					/>
				</svg>
				<span>{competition.federation.name} ({competition.federation.abbreviation})</span>
			</div>
		</div>
	</div>

	<!-- Categories -->
	{#if competition.categories && competition.categories.length > 0}
		<div class="space-y-8">
			{#each competition.categories as categoryDetail (categoryDetail.category.category_id)}
				<Card class="p-6">
					<!-- Category Header -->
					<div class="mb-6">
						<h2 class="mb-2 text-2xl font-medium text-white">{categoryDetail.category.name}</h2>
						<div class="flex flex-wrap gap-4 text-sm text-zinc-400">
							<span>Gender: {categoryDetail.category.gender}</span>
							{#if categoryDetail.category.weight_class_min || categoryDetail.category.weight_class_max}
								<span>
									Weight Class:
									{categoryDetail.category.weight_class_min || '0'}kg -
									{categoryDetail.category.weight_class_max || '∞'}kg
								</span>
							{/if}
						</div>
					</div>

					<!-- Participants -->
					{#if categoryDetail.participants && categoryDetail.participants.length > 0}
						<div class="overflow-x-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b border-zinc-800">
										<th class="px-4 py-3 text-left font-medium text-zinc-400">Rank</th>
										<th class="px-4 py-3 text-left font-medium text-zinc-400">Athlete</th>
										<th class="px-4 py-3 text-left font-medium text-zinc-400">Country</th>
										<th class="px-4 py-3 text-left font-medium text-zinc-400">Bodyweight</th>
										{#each categoryDetail.participants[0]?.lifts || [] as lift (lift.movement_name)}
											<th class="px-4 py-3 text-center font-medium text-zinc-400">
												{lift.movement_name}
											</th>
										{/each}
										<th class="px-4 py-3 text-left font-medium text-zinc-400">Total</th>
										<th class="px-4 py-3 text-left font-medium text-zinc-400">RIS Score</th>
									</tr>
								</thead>
								<tbody>
									{#each categoryDetail.participants as participant (participant.athlete.athlete_id)}
										<tr
											class="border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/30 {participant.is_disqualified
												? 'opacity-50'
												: ''}"
										>
											<td class="px-4 py-3 text-white">
												{#if participant.is_disqualified}
													<span class="text-red-400">DQ</span>
												{:else}
													{participant.rank || '-'}
												{/if}
											</td>
											<td class="px-4 py-3 text-white">
												<a
													href={resolve(`/athletes/${participant.athlete.slug}`)}
													class="hover:text-zinc-300 hover:underline"
												>
													{participant.athlete.first_name}
													{participant.athlete.last_name}
												</a>
												{#if participant.is_disqualified && participant.disqualified_reason}
													<span class="ml-2 text-xs text-red-400"
														>({participant.disqualified_reason})</span
													>
												{/if}
											</td>
											<td class="px-4 py-3 text-zinc-400">{participant.athlete.country}</td>
											<td class="px-4 py-3 text-zinc-400">{formatWeight(participant.bodyweight)}</td
											>
											{#each participant.lifts as lift (lift.movement_name)}
												<td class="px-4 py-3">
													<div class="flex flex-col items-center gap-1">
														<div class="font-medium text-white">
															{formatWeight(lift.best_weight)}
														</div>
														<div class="flex gap-1">
															{#each lift.attempts as attempt (attempt.attempt_number)}
																<span
																	class="flex h-5 w-5 items-center justify-center rounded text-xs {attempt.is_successful
																		? 'bg-emerald-500/20 text-emerald-400'
																		: 'bg-red-500/20 text-red-400'}"
																	title="{attempt.weight}kg - {attempt.is_successful
																		? 'Success'
																		: attempt.no_rep_reason || 'Failed'}"
																>
																	{attempt.attempt_number}
																</span>
															{/each}
														</div>
													</div>
												</td>
											{/each}
											<td class="px-4 py-3 font-medium text-white">
												{formatWeight(participant.total)}
											</td>
											<td class="px-4 py-3 text-zinc-400">
												{participant.ris_score || '-'}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<p class="text-center text-zinc-500">No participants in this category</p>
					{/if}
				</Card>
			{/each}
		</div>
	{:else}
		<Card class="p-8">
			<p class="text-center text-zinc-400">
				No categories or results available for this competition
			</p>
		</Card>
	{/if}
</div>
