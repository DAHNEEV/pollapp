<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema.js';
	import { Control, ElementField, Field, FieldErrors, Fieldset } from 'formsnap';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import { Trash } from '@lucide/svelte';
	import Label from '$lib/components/label.svelte';
	import * as Card from '$lib/components/card/index.js';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zod4Client(formSchema)
	});
	const { form: formData, enhance, submitting } = form;

	function removeOptionByIndex(index: number) {
		$formData.options = $formData.options.filter((_, i) => i !== index);
	}

	function addOption() {
		if ($formData.options.length < 12) {
			$formData.options = [...$formData.options, ''];
		}
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header>
		<Card.Title class="text-center text-2xl">Create a poll</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="flex flex-col gap-6">
			<Field {form} name="question">
				<Control>
					{#snippet children({ props })}
						<div class="flex flex-col justify-center">
							<Label class="mb-2 text-base leading-4">Question</Label>
							<Input {...props} bind:value={$formData.question} />
							<FieldErrors />
							<!-- todo better error component -->
						</div>
					{/snippet}
				</Control>
			</Field>
			<Fieldset {form} name="options" class="flex flex-col">
				<Label class="mb-3 text-base leading-4">Options</Label>
				{#each $formData.options as _, i}
					<ElementField {form} name="options[{i}]">
						<Control>
							{#snippet children({ props })}
								<div class="mb-3 flex items-center justify-center gap-2">
									<Label class="text-md flex size-9 items-center justify-center">{i + 1}.</Label>
									<Input {...props} bind:value={$formData.options[i]} />
									<Button size="icon" variant="destructive" onclick={() => removeOptionByIndex(i)}>
										<Trash />
									</Button>
								</div>
							{/snippet}
						</Control>
					</ElementField>
				{/each}
				<Button variant="ghost" size="sm" class="mr-0 ml-auto w-fit" onclick={addOption}>
					Add Option
				</Button>
				<FieldErrors />
			</Fieldset>
			<Field {form} name="expired">
				<Control>
					{#snippet children({ props })}
						<div class="flex flex-col justify-center">
							<Label class="mb-2 text-base leading-4">Expiration time (hours)</Label>
							<Input type="number" min="1" {...props} bind:value={$formData.expired} />
							<FieldErrors />
						</div>
					{/snippet}
				</Control>
			</Field>
			<Button type="submit" loading={$submitting}>Create</Button>
		</form>
	</Card.Content>
</Card.Root>
