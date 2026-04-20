<script lang="ts">
  import { getFaviconUrl } from "$lib/utils/helpers";
  import { ChevronDown } from "@lucide/svelte";
  import CredentialBody from "./credential-body.svelte";
  import type { Credential } from ".";

  let { credential }: { credential: Credential } = $props();

  let showDropdown: boolean = $state(false);

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };
</script>

<article class="border border-gray-200 rounded-md px-4 py-2.5">
  <button type="button" onclick={toggleDropdown} class="w-full cursor-pointer">
    {@render header(credential)}
  </button>

  {#if showDropdown}
    <CredentialBody {credential} />
  {/if}
</article>

{#snippet header(credential: Credential)}
  <div class="flex justify-between lg:items-center">
    <div class="flex lg:items-center max-lg:flex-col gap-2">
      <div class="flex items-center gap-x-4">
        {#if credential.websiteUrl}
          <img
            src={getFaviconUrl(credential.websiteUrl)}
            alt={credential.name}
            width="20"
          />
        {:else}
          <div
            class="text-base font-medium bg-gray-100 text-blue-400 w-6 h-6 flex justify-center items-center rounded-full"
          >
            {credential.name.charAt(0)}
          </div>
        {/if}
        <h3 class="font-medium">{credential.name}</h3>
      </div>

      <p class="text-sm text-gray-600 text-left">
        {#if credential.username}
          <span>{credential.username}</span>
        {:else}
          <span>{credential.email}</span>
        {/if}
      </p>
    </div>
    <ChevronDown size={20} color="gray" />
  </div>
{/snippet}
