<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { toast } from "svelte-sonner";
  import Button from "../../button/button.svelte";
  import Input from "../../input/input.svelte";
  import { goto } from "$app/navigation";
  import { decryptMainKey, storeEncryptionKeyLocally } from "$lib/utils/cipher";
  import { ERRORS } from "$lib/utils/constants";

  let { isOpen } = $props();

  let loading: boolean = $state(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      loading = true;
      const password = new FormData(e.target as HTMLFormElement).get(
        "password",
      );

      if (!password) throw new Error("Please Enter Password");

      const resp = await fetch("/api/get-encryption-key");

      const data = await resp.json();


      if (data.message === ERRORS.SESSION_EXPIRED)
        throw new Error(ERRORS.SESSION_EXPIRED);

      const encryptionKey = await decryptMainKey(
        data.encryptionKey,
        password as string,
      );

      await storeEncryptionKeyLocally(encryptionKey);

      isOpen = false;
    } catch (err: any) {
      toast.error(err.message);

      if (err.message === ERRORS.SESSION_EXPIRED) {
        setTimeout(async () => {
          await goto("/login");
        }, 600);
      }
      console.log({ err });
    } finally {
      loading = false;
    }
  };
</script>

<Drawer.Root dismissible={false} open={isOpen}>
  <Drawer.Content class="max-w-xl mx-auto">
    <Drawer.Header>
      <Drawer.Title>Please Enter your Master Password</Drawer.Title>
    </Drawer.Header>
    <form onsubmit={handleSubmit} class="px-4">
      <Input placeholder="Master password" name="password" type="password"/>
      <Drawer.Footer class="px-0">
        <Button type="submit" disabled={loading} aria-disabled={loading}
          >Submit</Button
        >
        <Drawer.Close disabled={loading} aria-disabled={loading}
          >Cancel</Drawer.Close
        >
      </Drawer.Footer>
    </form>
  </Drawer.Content>
</Drawer.Root>
