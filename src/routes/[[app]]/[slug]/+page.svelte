<script lang="ts">
  import Credential from "$lib/components/credential/credential.svelte";

  const { data } = $props();

  const credentials = $derived(data.credentials);
</script>

<div class="mt-5 space-y-4">
  {#each credentials as credential}
    <Credential {credential} />
  {/each}
</div>
