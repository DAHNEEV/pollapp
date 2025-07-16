<script lang="ts">
	import * as Chart from '$lib/components/chart/index.js';
	import * as Card from '$lib/components/card/index.js';
	import type { PageProps } from './$types';
	import { BarChart, Labels } from 'layerchart';
	import Button from '$lib/components/button.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	const renderContext = 'svg';
	const debug = false;

	const chartConfig = {
		desktop: {
			label: 'Votes',
			color: 'var(--primary-foreground)'
		}
	} satisfies Chart.ChartConfig;

	let descending = $state(false);

	let votes = $derived(
		descending ? [...data.votes].sort((a, b) => b.count - a.count) : [...data.votes]
	);

	function toggleSort() {
		descending = !descending;
	}

	async function reloadData() {
		await invalidateAll();
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header>
		<Card.Title class="text-center text-2xl">{data.poll.question}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-4 flex justify-between">
			<Button href="/{data.poll.id}" variant="outline">Edit vote</Button>
			<Button onclick={reloadData} variant="outline">Reload data</Button>
			<Button onclick={toggleSort} variant="outline">Sort data</Button>
		</div>
		<Chart.Container config={chartConfig}>
			<BarChart
				data={votes}
				x="count"
				y="text"
				labels={{ format: (value) => String(Math.floor(value)) }}
				orientation="horizontal"
				axis="x"
				{renderContext}
				{debug}
			>
				{#snippet aboveMarks()}
					<Labels
						x={(d) => 0}
						value="text"
						fill="var(--color-desktop)"
						class="stroke-none text-base"
					/>
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip hideIndicator />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
