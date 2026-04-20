<script lang="ts">
  import { page } from "$app/state";
  import { AddCredentialDrawer } from "$lib/components/ui/layout/add-credential-drawer";

  let { children } = $props();

  const isNewRoute: boolean = $derived(page.url.pathname.endsWith("/new"));
</script>

{#if isNewRoute}
  <AddCredentialDrawer />
{/if}

{@render children()}
