<script lang="ts">
	import Dialog, * as D from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import IconButton from '@smui/icon-button';
	import Textfield from '@smui/textfield';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card, * as C from '@smui/card';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	onMount(() => console.log(form));
</script>

<h1 style="text-align: center;">publish a new notification</h1>
<form method="POST" action="?/create" use:enhance>
	<Card class="form">
		<C.Content>
			{#if form?.message}
				<p class="message">{form.message}</p>
			{/if}
			<Textfield input$maxlength={18} label="Title" input$name="title" value="" />
			<Textfield textarea input$maxlength={18} label="Body" input$name="contentText" value="" />
		</C.Content>
		<C.Actions>
			<Button variant="raised" type="submit">
				<Label>Send Notification</Label>
			</Button>
		</C.Actions>
	</Card>
</form>

<h1 style="text-align: center;">X notifications</h1>
<p>todo:</p>
<LayoutGrid>
	<!-- {#each $subscriptions.reverse() as subscription}
			<Cell>
				<Card>
					<C.Content>
						<SubInfoDisplay {subscription} />
					</C.Content>
					<C.Actions>
						<Button
							variant="raised"
							on:click={() => {
								subId = subscription._id;
								sendNotifDialogOpen = true;
							}}
						>
							<Label>Send Notification</Label>
						</Button>
					</C.Actions>
				</Card>
			</Cell>
		{/each} -->
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
