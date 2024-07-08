<script lang="ts">
	import '$lib/app.scss';
	import TopAppBar, * as TAB from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
</script>

<TopAppBar variant="static" style="position: sticky; top: 0;">
	<TAB.Row>
		<TAB.Section>
			<TAB.Title>Fair Notification Sender</TAB.Title>
		</TAB.Section>
		<TAB.Section align="end" toolbar>
			<IconButton class="material-icons" aria-label="Key" on:click={null}>key</IconButton>
			<IconButton class="material-icons" aria-label="Refresh" on:click={null}>refresh</IconButton>
		</TAB.Section>
	</TAB.Row>
</TopAppBar>
<main style="max-width: 90%; margin: 0 auto;">
	<slot />
</main>
