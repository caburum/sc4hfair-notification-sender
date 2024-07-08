<script lang="ts">
	import Dialog, * as D from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import IconButton from '@smui/icon-button';
	import Textfield from '@smui/textfield';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card, * as C from '@smui/card';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h1 style="text-align: center;">publish a new notification</h1>
<form method="POST" action="?/create" autocomplete="off" use:enhance>
	<Card class="form">
		<C.Content>
			{#if form?.action == 'create' && form?.message}
				<p class="message">{form.message}</p>
			{/if}
			<Textfield input$maxlength={120} label="Title" input$name="title" value="" />
			<!-- todo: add markdown editor & image support (https://github.com/contentful/field-editors) -->
			<Textfield textarea input$maxlength={50000} label="Body" input$name="contentText" value="" />
		</C.Content>
		<C.Actions>
			<Button variant="raised" type="submit">
				<Label>Send Notification</Label>
			</Button>
		</C.Actions>
	</Card>
</form>

<h1 style="text-align: center; margin-bottom: 0;">{data.entries.length} previous posts</h1>
{#if form?.action == 'remove' && form?.message}
	<p class="message">{form.message}</p>
{/if}
<LayoutGrid>
	{#each data.entries as entry}
		<Cell>
			<Card>
				<C.Content>
					<h3>{entry.title}</h3>
					<p style="word-wrap: break-word;">{entry.contentText}</p>
				</C.Content>
				<C.Actions>
					<form method="POST" action="?/remove" use:enhance>
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

<style lang="scss">
	form {
		display: grid;
		place-items: center;

		.message {
			margin: 0;
			text-align: center;
			font-style: italic;
		}
	}
	:global(.form) {
		width: fit-content;
		min-width: min(95%, 600px);
	}
	:global(.form > div) {
		display: flex;
		flex-direction: column;
		gap: 0.75em;
		justify-content: center;
	}
	:global(.form .mdc-text-field) {
		width: 100%;
		// min-width: calc(350px - 16px);
	}
	:global(.form input) {
		flex-grow: 1;
	}
</style>
