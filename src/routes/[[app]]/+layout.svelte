<script lang="ts">
  import PasswordDrawer from "$lib/components/ui/layout/password-drawer/password-drawer.svelte";
  import { Sidebar } from "$lib/components/ui/layout/sidebar";
  import Topbar from "$lib/components/ui/layout/tobar/topbar.svelte";
  import { getEncryptionKeyFromLocalStorage } from "$lib/utils/cipher";

  let { children } = $props();
  let showPasswordDrawer = $state(false);

  $effect(() => {
    const checkEncryptionKey = async () => {
      const encryptionKey = await getEncryptionKeyFromLocalStorage();
      if (!encryptionKey) {
        showPasswordDrawer = true;
      }
    };

    checkEncryptionKey();
  });
</script>

{#if showPasswordDrawer}
  <PasswordDrawer isOpen={showPasswordDrawer} />
{/if}

<div
  class="pt-5 lg:pt-14 grid lg:grid-cols-[auto_1fr] border-r-amber-100 h-screen lg:px-10"
>
  <Sidebar />
  <div class="px-4 lg:pl-8">
    <Topbar />
    {@render children()}
  </div>
</div>
