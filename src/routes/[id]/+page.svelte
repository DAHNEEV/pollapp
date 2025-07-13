<script lang="ts">
	import * as Card from '$lib/components/card/index.js';
	import { Control, FieldErrors, Fieldset } from 'formsnap';
	import type { PageProps } from './$types';
	import * as RadioGroup from '$lib/components/radio-group/index.js';
	import Button from '$lib/components/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';
	import Label from '$lib/components/label.svelte';

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zod4Client(formSchema)
	});
	const { form: formData, enhance, submitting } = form;
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header>
		<Card.Title class="text-center text-2xl">{data.poll.question}</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="flex flex-col gap-5">
			<Fieldset {form} name="optionId" class="space-y-3">
				<RadioGroup.Root
					bind:value={$formData.optionId}
					class="flex flex-col space-y-1"
					name="optionId"
				>
					{#each data.options as option}
						<div class="flex items-center space-y-0 space-x-3">
							<Control>
								{#snippet children({ props })}
									<RadioGroup.Item value={option.id} {...props} />
									<Label for={props.id} class="text-base font-normal">{option.text}</Label>
								{/snippet}
							</Control>
						</div>
					{/each}
				</RadioGroup.Root>
				<FieldErrors />
			</Fieldset>
			<Button type="submit" loading={$submitting}>Vote</Button>
		</form>
	</Card.Content>
</Card.Root>
