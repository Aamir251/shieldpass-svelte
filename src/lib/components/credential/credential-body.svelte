<script lang="ts">
  import {
    decryptCredentialPassword,
    getEncryptionKeyFromLocalStorage,
  } from "$lib/utils/cipher";
  import { toast } from "svelte-sonner";
  import type { Credential } from ".";
  import { CopyIcon, ExternalLink, KeyRound, Loader, Mail, SquarePen, User } from "@lucide/svelte";
  import Button from "../ui/button/button.svelte";
  let { credential }: { credential: Credential } = $props();

  let isCopying: boolean = $state(false);

  const copyPassword = async () => {
    try {
      isCopying = true;

      const encryptionKey = await getEncryptionKeyFromLocalStorage();

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

<div class="rounded-xl border border-white/40 bg-white/28 p-4 backdrop-blur-lg">
  <div class="space-y-3">
    <div class="grid grid-cols-[20px_1fr] items-start gap-2 text-sm">
      <User size={16} class="mt-0.5 text-muted-foreground" />
      <div>
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Username</p>
        <p class="font-medium text-foreground">{credential?.username || "N/A"}</p>
      </div>
    </div>

    <div class="grid grid-cols-[20px_1fr] items-start gap-2 text-sm">
      <Mail size={16} class="mt-0.5 text-muted-foreground" />
      <div>
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
        <p class="font-medium text-foreground">{credential.email || "N/A"}</p>
      </div>
    </div>

    <div class="grid grid-cols-[20px_1fr] items-start gap-2 text-sm">
      <KeyRound size={16} class="mt-0.5 text-muted-foreground" />
      <div class="flex items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-wide text-muted-foreground">Password</p>
          <p class="font-medium text-foreground">***********</p>
        </div>
        <button
          onclick={copyPassword}
          disabled={isCopying}
          aria-disabled={isCopying}
          class="rounded-md border border-white/45 bg-white/35 p-2 text-foreground transition hover:bg-white/55 disabled:opacity-60"
          aria-label="Copy password"
        >
          {#if isCopying}
            <Loader size={16} class="animate-spin" />
          {:else}
            <CopyIcon size={16} />
          {/if}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-[20px_1fr] items-start gap-2 text-sm">
      <ExternalLink size={16} class="mt-0.5 text-muted-foreground" />
      <div>
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Website</p>
        {#if credential.websiteUrl}
          <a
            target="_blank"
            rel="noreferrer"
            href={credential.websiteUrl}
            class="break-all font-medium text-blue-700 hover:underline dark:text-blue-300"
          >
            {credential.websiteUrl}
          </a>
        {:else}
          <p class="font-medium text-foreground">N/A</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="mt-4 flex justify-end">
    <Button
      class="inline-flex items-center gap-2"
      variant="outline"
      href="/edit?credential={credential.id}"
    >
      <SquarePen size={14} />
      Edit
    </Button>
  </div>
</div>
