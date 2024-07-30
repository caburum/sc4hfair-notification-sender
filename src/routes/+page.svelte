<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Card, * as C from '@smui/card';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Textfield from '@smui/textfield';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { requireAuth } from '$lib/auth';
	import type { PageData, ActionData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;

	async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		loading = true;

		const body = new FormData(event.currentTarget),
			formElement = event.currentTarget;

		const password = await requireAuth();
		body.append('password', password);

		const response = await fetch(formElement.action, {
			method: 'POST',
			body
		});

		if (!response.ok) {
			form = {
				message: `${response.status} ${response.statusText}: ${await response.clone().text()}` as any,
				action: formElement.action.split('?/')[1] as any
			};
			loading = false;
			return;
		}

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			HTMLFormElement.prototype.reset.call(formElement);
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);

		loading = false;
	}
</script>

<h1>Publish a New Notification</h1>
<div style="width: fit-content; margin: 0 auto;">
	<p style="text-align: center;">Where will this go?</p>
	<ul style="padding-inline-start: 1em;">
		<li>4-H Fair App front page</li>
		<li>Phone notifications (subscribe in the app)</li>
	</ul>
</div>
<form method="POST" action="?/create" autocomplete="off" on:submit|preventDefault={handleSubmit}>
	<Card class="form">
		<C.Content>
			{#if form?.action == 'create' && form?.message}
				<p class="message">{form.message}</p>
			{/if}
			<Textfield input$required input$maxlength={120} label="Title" input$name="title" value="" />
			<!-- todo: add markdown editor & image support (https://github.com/contentful/field-editors) -->
			<Textfield textarea input$maxlength={50000} label="Body" input$name="contentText" value="" />
		</C.Content>
		<C.Actions>
			<Button variant="raised" type="submit" disabled={loading}>
				<Label>Send Notification</Label>
				<!-- todo: add loading indicator -->
			</Button>
		</C.Actions>
	</Card>
</form>

{#if !data.authenticated}
	<h1 style="margin-bottom: 0;">Loading previous posts</h1>
	<!-- todo: spinner -->
{:else}
	<h1 style="margin-bottom: 0;">
		{data.entries.length} previous post{data.entries.length == 1 ? '' : 's'}
	</h1>
	{#if form?.action == 'remove' && form?.message}
		<p class="message">{form.message}</p>
	{/if}
	<LayoutGrid>
		{#each data.entries as entry}
			<Cell>
				<!-- todo: don't waste so much space -->
				<Card style="height: 100%;">
					<C.Content>
						<h3>{entry.title}</h3>
						<!-- todo: render markdown -->
						{#each entry.contentText.split('\n\n') as line}
							<p style="word-wrap: break-word;">{line}</p>
						{/each}
					</C.Content>
					<C.Actions>
						<form method="POST" action="?/remove" on:submit|preventDefault={handleSubmit}>
							<input type="hidden" name="id" value={entry.id} />
							<Button variant="raised" type="submit">
								<Label>remove</Label>
							</Button>
						</form>
					</C.Actions>
				</Card>
			</Cell>
		{/each}
	</LayoutGrid>
{/if}
