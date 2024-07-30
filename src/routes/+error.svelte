<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Help from '$lib/Help.svelte';
</script>

<main style="text-align: center;">
	<h1>Error {$page.status}: {$page.error?.message}</h1>
	<Button
		variant="raised"
		on:click={() =>
			goto('/', {
				invalidateAll: true
			})}
	>
		<Label>Try Again</Label>
	</Button>
	<br />
	<br />
	<Help />
</main>
