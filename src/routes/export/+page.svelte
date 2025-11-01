<script lang="ts">
	import { Button, FlexWrapper, LinkButton, Space } from "@davidnet/svelte-ui";

	async function downloadBackup() {
		try {
			const response = await fetch("/api/export/db");

			if (!response.ok) {
				throw new Error("Kon backup niet downloaden");
			}

			// Blob aanmaken van de response (het bestand)
			const blob = await response.blob();

			// Tijdelijke URL maken voor de blob
			const url = window.URL.createObjectURL(blob);

			// Virtuele <a> link aanmaken om het bestand te downloaden
			const a = document.createElement("a");
			a.href = url;
			a.download = `database-${new Date().toISOString().slice(0, 10)}.db`;
			document.body.appendChild(a);
			a.click();

			// Opruimen
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error(err);
			alert("Er is iets misgegaan bij het downloaden van de backup.");
		}
	}

	async function exportExcel() {
		const response = await fetch("/api/export/excel");
		if (!response.ok) {
			alert("Export mislukt");
			return;
		}
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `zolder-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<h1>Exports</h1>
<FlexWrapper gap="var(--token-space-1)">
	<Button appearance="primary" onClick={downloadBackup}>Export DB</Button>
	<Button appearance="primary" onClick={exportExcel}>Export Excel</Button>
	<Space height="var(--token-space-3)" />
	<LinkButton href="/">Home</LinkButton>
	<Button
		onClick={() => {
			history.back();
		}}>Terug</Button
	>
</FlexWrapper>
