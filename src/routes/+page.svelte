<script lang="ts">
	import { onMount } from "svelte";
	import { Button, LinkButton, Modal, Space, toast } from "@davidnet/svelte-ui";
	import type { Box } from "$lib/types";
	import { formatDate } from "$lib/utils";

	let boxes: Box[] = [];

	function sortBoxes() {
		boxes = boxes.sort((a, b) => a.id - b.id);
	}

	onMount(async () => {
		const res = await fetch("/api/boxes");
		if (!res.ok) {
			toast({
				title: "Kon dozen niet ophalen",
				desc: "Error: " + res.status + " | " + res.statusText,
				icon: "deployed_code_alert",
				appearance: "danger",
				position: "bottom-left"
			});
			console.error("Could not load boxes: " + res.status + " | " + res.statusText);
			return;
		}

		boxes = await res.json();
		sortBoxes();
	});

	let showAddBoxModal = false;

	async function AddBox() {
		showAddBoxModal = false;
		const res = await fetch("/api/box/", { method: "POST" });

		if (res.ok) {
			const newBox: Box = await res.json();
			boxes = [...boxes, newBox];
			sortBoxes();
			toast({
				title: "Doos toegevoegd",
				desc: "Doos " + newBox.id + " is succesvol aangemaakt.",
				icon: "package_2",
				appearance: "success",
				position: "bottom-left",
				autoDismiss: 3000
			});
		} else {
			toast({
				title: "Doos niet toegevoegd",
				desc: "Error: " + res.status + " | " + res.statusText,
				icon: "deployed_code_alert",
				appearance: "danger",
				position: "bottom-left"
			});
			console.error("Could not create box: " + res.status + " | " + res.statusText);
		}
	}
</script>

<main class="container">
	<h1 class="title">Zolder Opruimer</h1>
	<p class="subtitle">Vind spullen op de zolder via de zoekbalk hierboven.</p>
	<Space height="var(--token-space-6)" />

	<h2>Alle dozen</h2>

	{#if boxes.length === 0}
		<p class="empty">Kon geen dozen vinden.</p>
	{:else}
		<div class="grid">
			{#each boxes as box (box.id)}
				<div class="box">
					<div class="box-id">{box.id}</div>
					<div class="box-date">
						Aangemaakt:<br />{formatDate(box.created_at)}
					</div>
					<LinkButton appearance="subtle" href={`/box/${box.id}/`}>Open</LinkButton>
				</div>
			{/each}
		</div>
	{/if}

	<Space height="var(--token-space-4)" />

	<Button
		onClick={() => (showAddBoxModal = true)}
		appearance="primary"
		iconbefore="box_add"
	>
		Doos toevoegen
	</Button>

	{#if showAddBoxModal}
		<Modal
			title="Doos toevoegen"
			titleIcon="box_add"
			desc="Weet je zeker dat je een doos wil toevoegen?"
			hasCloseBtn
			on:close={() => (showAddBoxModal = false)}
			options={[
				{ appearance: "primary", content: "Doos toevoegen", onClick: AddBox },
				{ appearance: "subtle", content: "Annuleren", onClick: () => (showAddBoxModal = false) }
			]}
		/>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: system-ui, sans-serif;
		background-color: var(--token-color-surface-raised-low);
		color: var(--token-color-text-default-primary);
	}

	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem;
		text-align: center;
	}

	.title {
		font-size: clamp(2.5rem, 5vw, 5rem);
		margin-bottom: 0.25rem;
		line-height: 1.2;
	}

	.subtitle {
		font-size: clamp(1rem, 2.5vw, 1.25rem);
		color: var(--token-color-text-default-secondary);
		margin-bottom: 2rem;
	}

	h2 {
		font-size: clamp(1.5rem, 3vw, 2rem);
		margin-bottom: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		justify-items: center;
	}

	.box {
		padding: 1rem;
		border: 1px solid var(--token-color-text-default-tertiary);
		border-radius: 12px;
		background: var(--token-color-surface-raised-normal);
		text-align: center;
		width: 100%;
		max-width: 180px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.box:hover {
		transform: translateY(-3px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.box-id {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	.box-date {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--token-color-text-default-disabled);
		margin-bottom: 0.5rem;
	}

	.empty {
		color: var(--token-color-text-default-disabled);
		font-style: italic;
		margin-top: 1rem;
	}

	/* Mobiel optimalisatie */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
		}

		.box {
			max-width: 100%;
		}
	}
</style>
