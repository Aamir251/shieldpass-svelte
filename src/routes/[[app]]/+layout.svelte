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
  class=" border-r-amber-100 h-screen grid grid-cols-[auto_1fr]"
>
  <Sidebar />
  <div class="px-3 lg:pl-6 pt-8">
    <Topbar />
    {@render children()}
  </div>
</div>
