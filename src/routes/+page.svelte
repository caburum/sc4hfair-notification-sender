<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Card, * as C from '@smui/card';
	import Dialog from '@smui/dialog';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { postTypes, SPACE_ID, webhook } from '$lib/contentful';
	import { handleSubmit, loading, editingForm } from '$lib/form';
	import type { PageData, ActionData } from './$types';
	import PostEditor from '$lib/PostEditor.svelte';

	export let data: PageData;
	export let form: ActionData;

	// todo: move whole app into page? so action button don't get funky & we need less stores
	$: $webhook = data.webhook;
</script>

<form method="POST" action="?/edit" autocomplete="off" on:submit|preventDefault={handleSubmit} class="form">
	<Dialog open={$editingForm !== undefined} scrimClickAction="" escapeKeyAction="" surface$style="min-width: 600px">
		{#key $editingForm}
			<PostEditor action="edit" {form} />
		{/key}
	</Dialog>
</form>

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
		<PostEditor action="create" {form} />
	</Card>
</form>

{#if !data.authenticated}
	<h1 style="margin-bottom: 0;">Loading previous posts</h1>
{:else}
	<h1 style="margin-bottom: 0;">
		{data.entries.length} previous post{data.entries.length == 1 ? '' : 's'}
	</h1>
	{#if (form?.action === 'remove' || form?.action === 'edit') && form?.message}
		<p class="message">{form.message}</p>
	{/if}
	<LayoutGrid>
		{#each data.entries as entry}
			<Cell>
				<!-- todo: don't waste so much space -->
				<Card style="height: 100%;">
					<C.Content>
						<h3>
							<a
								href={`https://app.contentful.com/spaces/${SPACE_ID}/entries/${entry.id}`}
								target="_blank"
								style="color: inherit;">{entry.title}</a
							><br /><small style="font-style: italic;">({postTypes[entry.type || 'normal']})</small>
						</h3>
						<!-- todo: render markdown -->
						{#each entry.contentText.split('\n\n') as line}
							<p style="word-wrap: break-word;">{line}</p>
						{/each}
					</C.Content>
					<C.Actions>
						<form
							class="mdc-card__action mdc-card__action--button"
							method="POST"
							action="?/remove"
							on:submit|preventDefault={handleSubmit}
						>
							<input type="hidden" name="id" value={entry.id} />
							<Button variant="raised" type="submit" disabled={$loading}>
								<Label>remove</Label>
							</Button>
						</form>
						<Button variant="raised" disabled={$loading} on:click={() => editingForm.set(entry)}>
							<Label>edit</Label>
						</Button>
					</C.Actions>
				</Card>
			</Cell>
		{/each}
	</LayoutGrid>
{/if}
