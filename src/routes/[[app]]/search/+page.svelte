
<script lang="ts">
  import Credential from '$lib/components/credential/credential.svelte';
  import { Spinner } from '$lib/components/ui/spinner';

  const {data} = $props();

</script>


{#await data.getSearchCredentials}
  <div class="w-full max-w-3xl flex justify-center items-center h-72">
    <Spinner class="size-7" />
  </div>
{:then credentials}
<div class="pt-7 grid grid-cols-1 items-start gap-4 md:grid-cols-2 pb-4 xl:grid-cols-3 max-h-[calc(100vh-100px)] overflow-y-auto">
  {#each credentials as credential}
    <Credential {credential} />
  {/each}
</div>
{/await}
