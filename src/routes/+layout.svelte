<script lang="ts">
	import Dialog from '@smui/dialog';
	import IconButton from '@smui/icon-button';
	import TopAppBar, * as TAB from '@smui/top-app-bar';
	import '$lib/app.scss';
	import Authenticate from '$lib/Authenticate.svelte';
	import { initialAuthPassword, reAuthenticateCallback } from '$lib/auth';
	import { invalidateAll } from '$app/navigation';
</script>

<Dialog open={$reAuthenticateCallback !== undefined} scrimClickAction="" escapeKeyAction="">
	{#key $reAuthenticateCallback}
		<Authenticate cancelable />
	{/key}
</Dialog>

<TopAppBar variant="static" style="position: sticky; top: 0;">
	<TAB.Row>
		<TAB.Section>
			<TAB.Title>Fair Notification Sender</TAB.Title>
		</TAB.Section>
		<TAB.Section align="end" toolbar style="overflow-x: hidden;">
			<!-- todo: fix icon -->
			<IconButton class="material-icons" aria-label="Logout" on:click={() => ($initialAuthPassword = undefined)}
				>logout</IconButton
			>
			<IconButton class="material-icons" aria-label="Refresh" on:click={() => invalidateAll()}>refresh</IconButton>
		</TAB.Section>
	</TAB.Row>
</TopAppBar>

<main style="max-width: 90%; margin: 0 auto;" class:center={!$initialAuthPassword}>
	{#if $initialAuthPassword}
		<slot />
	{:else}
		<Authenticate />
	{/if}
</main>

<style lang="scss">
	@use '@material/top-app-bar/_variables' as top-app-bar;

	:global(main form > .mdc-dialog__title::before) {
		// quick fix to make the auth form centered since it's not in a dialog
		height: 0;
	}

	.center {
		display: grid;
		height: calc(100% - top-app-bar.$row-height);
		place-content: center;
	}
</style>
