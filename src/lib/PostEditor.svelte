<script lang="ts">
	import Button, { Label } from '@smui/button';
	import * as C from '@smui/card';
	import * as D from '@smui/dialog';
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import { postTypes } from '$lib/contentful';
	import { editingForm, loading } from '$lib/form';
	import type { ActionData } from '../routes/$types';

	// pass page's form data to the editor
	export let form: ActionData;

	export let action: string;

	let initialData = $editingForm;

	let contentComponent = action === 'edit' ? D.Content : C.Content;
	let actionsComponent = action === 'edit' ? D.Actions : C.Actions;
</script>

{#if action === 'edit'}
	<D.Title>Editing "{initialData?.title || ''}"</D.Title>
{/if}

<svelte:component this={contentComponent} class="formContent">
	{#if form?.action === 'create' && form?.message}
		<p class="message">{form.message}</p>
	{/if}
	{#if action === 'edit'}
		<input type="hidden" name="id" value={initialData?.id} />
	{/if}
	<Textfield input$required input$maxlength={120} label="Title" input$name="title" value={initialData?.title || ''} />
	<!-- todo: add markdown editor & image support (https://github.com/contentful/field-editors) -->
	<Textfield
		textarea
		input$maxlength={50000}
		input$rows={4}
		label="Body"
		input$name="contentText"
		value={initialData?.contentText || ''}
	/>
	{#if action === 'create'}
		<Select key={(t) => `${t ? t.id : ''}`} label="Type" hiddenInput input$name="type" value="normal">
			{#each postTypes as type}
				<Option value={type.id}>{type.label}</Option>
			{/each}
		</Select>
	{/if}
</svelte:component>
<svelte:component this={actionsComponent}>
	{#if action === 'edit'}
		<Button variant="raised" action="close" type="button">
			<Label>Cancel</Label>
		</Button>
		<Button variant="raised" type="submit" data-mdc-dialog-button-default>
			<Label>Edit</Label>
		</Button>
	{:else if action === 'create'}
		<Button variant="raised" type="submit" disabled={$loading}>
			<Label>Send Notification</Label>
		</Button>
	{/if}
</svelte:component>
