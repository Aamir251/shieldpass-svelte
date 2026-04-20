<script lang="ts">
  import {
    decryptCredentialPassword,
    getEncryptionKeyFromLocalStorage,
  } from "$lib/utils/cipher";
  import { toast } from "svelte-sonner";
  import type { Credential } from ".";
  import { CopyIcon, Loader } from "@lucide/svelte";
  import Button from "../ui/button/button.svelte";
  let { credential }: { credential: Credential } = $props();

  let isCopying: boolean = $state(false);

  const copyPassword = async () => {
    try {
      isCopying = true;

      const encryptionKey = await getEncryptionKeyFromLocalStorage();

      console.log({ encryptionKey })

      if (!encryptionKey) throw new Error("KEY_NOT_FOUND");
      const { data, iv } = credential.password;
      await navigator.clipboard.writeText(
        await decryptCredentialPassword(data, iv, encryptionKey!),
      );
      toast.success("Password Copied 🎉");
    } catch (err: any) {
      console.log({ err });
      toast.error(err.message || "Something went wrong");
    } finally {
      isCopying = false;
    }
  };
</script>

<div class="border border-gray-200 rounded-md p-4 mt-3 relative max-lg:pb-12">
  <ul class="flex flex-col gap-4 text-sm font-medium text-gray-800">
    <li>
      Username : {credential?.username || "N/A"}
    </li>
    <li>
      email : {credential.email || "N/A"}
    </li>
    <li>
      password : ***********
      <button
        onclick={copyPassword}
        disabled={isCopying}
        aria-disabled={isCopying}
        class="ml-2 cursor-pointer hover:opacity-70"
      >
        {#if isCopying}
          <Loader size={16} />
        {:else}
          <CopyIcon size={16} />
        {/if}
      </button>
    </li>
    <li>
      Website : <span>
        {#if credential.websiteUrl}
          <a target="_blank" href={credential.websiteUrl}
            >{credential.websiteUrl}</a
          >
        {:else}
          N/A
        {/if}
      </span>
    </li>
  </ul>

  <Button
    class="absolute bottom-1 right-2"
    variant="link"
    href="/edit?credential={credential.id}">Edit</Button
  >
</div>
