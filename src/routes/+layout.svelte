<script lang="ts">
	import Dialog from '@smui/dialog';
	import IconButton from '@smui/icon-button';
	import TopAppBar, * as TAB from '@smui/top-app-bar';
	import { invalidateAll } from '$app/navigation';
	import '$lib/app.scss';
	import { initialAuthPassword, reAuthenticateCallback } from '$lib/auth';
	import Authenticate from '$lib/Authenticate.svelte';
	import { webhook } from '$lib/contentful';
	import { loading } from '$lib/form';
	import LoadingRing from '$lib/LoadingRing.svelte';
</script>

<svelte:head>
	<title>Fair Notification Sender</title>
</svelte:head>

<TopAppBar variant="static" style="position: sticky; top: 0;">
	<TAB.Row>
		<TAB.Section>
			<TAB.Title>Fair Notification Sender</TAB.Title>
		</TAB.Section>
		<TAB.Section align="end" toolbar style="overflow-x: hidden;">
			<LoadingRing loading={$loading} />
			{#if $webhook !== undefined}
				<IconButton
					class="material-icons"
					aria-label="Webhook Status"
					title={$webhook ? 'Webhook enabled' : 'Webhook disabled'}
					style="pointer-events: auto;"
					disabled>{$webhook ? 'notifications_active' : 'notification_important'}</IconButton
				>
			{/if}
			<IconButton
				class="material-icons"
				aria-label="Logout"
				title="Logout"
				on:click={() => {
					$initialAuthPassword = undefined;
					$webhook = undefined;
				}}>logout</IconButton
			>
			<IconButton class="material-icons" aria-label="Refresh" title="Refresh" on:click={() => invalidateAll()}
				>refresh</IconButton
			>
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

<Dialog
	open={$reAuthenticateCallback !== undefined}
	scrimClickAction=""
	escapeKeyAction=""
	on:SMUIDialog:closed={() => {
		$reAuthenticateCallback?.(undefined);
	}}
>
	{#key $reAuthenticateCallback}
		<Authenticate cancelable />
	{/key}
</Dialog>

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
