# Glass Design System (Svelte)

This project uses a glassmorphic UI style driven by theme tokens defined in:

- `src/routes/layout.css`
  - Surfaces: `--card`, `--popover`, `--sidebar`
  - Borders/inputs: `--border`, `--input`
  - Global background: `body` gradients for the “ambient” look

## Updated reusable primitives

The following existing UI primitives were updated to render with translucent fills + `backdrop-filter` blur:

- `src/lib/components/ui/button/button.svelte` (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`)
- `src/lib/components/ui/input/input.svelte`
- `src/lib/components/ui/card/card.svelte`
- `src/lib/components/ui/select/*`
- `src/lib/components/ui/dialog/dialog-content.svelte` + `dialog-overlay.svelte`
- `src/lib/components/ui/drawer/drawer-content.svelte` + `drawer-overlay.svelte`
- `src/lib/components/ui/layout/sidebar/*` (so navigation also matches)

## Quick usage

```svelte
<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
</script>

<Card>
	<h2 class="text-lg font-semibold">Glass Card</h2>
	<Input placeholder="Search..." class="mt-3" />
	<div class="mt-3 flex gap-2">
		<Button variant="default">Primary</Button>
		<Button variant="outline">Outline</Button>
	</div>
</Card>
```

## Where to tweak the look

If you want to adjust the glass strength or colors, update the CSS variables in `src/routes/layout.css`.

If you want to adjust component radii/blur intensity, update the Tailwind classes inside the primitives listed above.

