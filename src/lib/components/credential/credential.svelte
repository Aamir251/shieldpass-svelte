<script lang="ts">
  import { getFaviconUrl } from "$lib/utils/helpers";
  import { ChevronDown, Globe } from "@lucide/svelte";
  import CredentialBody from "./credential-body.svelte";
  import type { Credential } from ".";

  let { credential }: { credential: Credential } = $props();

  let showDropdown: boolean = $state(false);
  const detailsId = $derived(`credential-details-${credential.id}`);

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };
</script>

<article
  class="group rounded-2xl border border-white/35 bg-card/70 p-4 backdrop-blur-xl shadow-sm transition-all hover:-translate-y-0.5 hover:border-white/55 hover:shadow-lg"
>
  <button
    type="button"
    onclick={toggleDropdown}
    class="w-full cursor-pointer text-left"
    aria-expanded={showDropdown}
    aria-controls={detailsId}
  >
    {@render header(credential, showDropdown)}
  </button>

  {#if showDropdown}
    <div id={detailsId} class="mt-3">
      <CredentialBody {credential} />
    </div>
  {/if}
</article>

{#snippet header(credential: Credential, expanded: boolean)}
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-3">
        {#if credential.websiteUrl}
          <img
            src={getFaviconUrl(credential.websiteUrl)}
            alt={credential.name}
            width="24"
            class="rounded-md border border-white/40 bg-white/50 p-0.5"
          />
        {:else}
          <div
            class="h-7 w-7 rounded-md border border-white/40 bg-white/45 text-sm font-semibold text-sky-700 dark:text-sky-200 flex items-center justify-center"
          >
            {credential.name.charAt(0)}
          </div>
        {/if}
        <h3 class="truncate text-base font-semibold text-foreground">{credential.name}</h3>
      </div>
      <p class="mt-2 truncate text-sm text-muted-foreground">
        {credential.username || credential.email || "No username or email"}
      </p>
      <div class="mt-3 flex items-center gap-2">
        <span class="rounded-full border border-white/45 bg-white/35 px-2.5 py-1 text-xs font-medium text-foreground/90">
          Vault Item
        </span>
        {#if credential.websiteUrl}
          <span class="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/30 px-2.5 py-1 text-xs text-muted-foreground">
            <Globe size={12} />
            Linked
          </span>
        {/if}
      </div>
    </div>

    <span
      class="rounded-full border border-white/35 bg-white/30 p-1.5 text-muted-foreground transition-transform {expanded ? 'rotate-180' : ''}"
    >
      <ChevronDown size={16} />
    </span>
  </div>
{/snippet}
