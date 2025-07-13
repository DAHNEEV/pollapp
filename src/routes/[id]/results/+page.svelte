<script lang="ts">
	import * as Card from '$lib/components/card/index.js';
	import { BarChart } from 'layerchart';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header>
		<Card.Title class="text-center text-2xl">{data.poll.question}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="h-[500px] rounded-sm border p-4">
			<BarChart
				data={dateSeriesData}
				x="value"
				y="date"
				labels
				orientation="horizontal"
				axis="y"
				rule={false}
				props={{
					yAxis: {
						tickLabelProps: {
							textAnchor: 'start',
							dx: 6,
							class: 'fill-surface-300 stroke-none'
						},
						tickLength: 0
					}
				}}
				padding={{ left: 0, bottom: 16 }}
				{renderContext}
				{debug}
			/>
		</div>
	</Card.Content>
</Card.Root>
