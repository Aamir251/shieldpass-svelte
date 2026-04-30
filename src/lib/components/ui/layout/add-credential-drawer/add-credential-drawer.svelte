<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    encryptCredentialPassword,
    getEncryptionKeyFromLocalStorage,
  } from "$lib/utils/cipher";
  import { toast } from "svelte-sonner";
  import { Button } from "../../button";
  import { FieldGroup, Field, FieldLabel } from "../../field";
  import Input from "../../input/input.svelte";
  import CategoryDropdown from "$lib/components/credential/category-dropdown.svelte";
  import {
    Globe,
    KeySquare,
    Mail,
    Plus,
    ShieldUser,
    UserRound,
    X,
  } from "@lucide/svelte";

  const id = $props.id();

  let loading = $state<boolean>(false);

  const closeDrawer = () => {
    window.history.back();
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    loading = true;
    const formData = new FormData(e.target as HTMLFormElement);

    // encyrpt credential password

    const password = formData.get("password");
    let encryptedPassword;
    if (password) {
      const encryptionKey = await getEncryptionKeyFromLocalStorage();

      encryptedPassword = await encryptCredentialPassword(
        password as string,
        encryptionKey!,
      );
    }

    const fields = ["name", "username", "email", "websiteUrl", "category"];

    const credential: any = {};

    fields.forEach((field) => {
      credential[field] = formData.get(field);
    });

    credential.password = encryptedPassword;
    try {
      const resp = await fetch("/api/create-credential", {
        method: "POST",
        body: JSON.stringify(credential),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await resp.json();

      if (data.message === "Session Expired") {
        toast.error("Session Expired");
        setTimeout(() => {
          goto("/login");
        }, 600);
        return;
      }

      toast.success("Credential Created!");

      const form = document.querySelector(
        "#credential-form",
      ) as HTMLFormElement;
      form.reset();
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  };
</script>

<button
  type="button"
  onclick={closeDrawer}
  class="fixed inset-0 z-10 h-screen w-screen bg-black/10 backdrop-blur-[3px]"
  aria-label="Close add credential drawer"
></button>

<Card.Root
  class="fixed top-0 right-0 z-20 h-screen w-full max-w-2xl overflow-hidden rounded-none  bg-card/75 p-2 lg:pl-0 shadow-[0_20px_70px_rgba(15,23,42,0.03)] backdrop-blur-2xl"
>
  <div class="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-300/55 blur-[140px]"></div>
  <div class="absolute top-1/3 -left-28 h-64 w-64 rounded-full bg-sky-300/15 blur-[160px]"></div>
  <div class="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-pink-300/30 blur-[150px]"></div>

  <Card.Content class="relative z-10 h-full overflow-y-auto rounded-md border border-white/15 bg-white/20 px-4 py-5 backdrop-blur-xl sm:px-6">
    <div class="mb-6 flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold tracking-[0.16em] text-muted-foreground">NEW ENTRY</p>
        <h2 class="mt-1 text-2xl font-semibold text-foreground">Add Credential</h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Store account details in your secure glass vault.
        </p>
      </div>
      <Button type="button" variant="ghost" size="icon-sm" onclick={closeDrawer} aria-label="Close drawer">
        <X size={16} />
      </Button>
    </div>

    <form id="credential-form" class="space-y-5" onsubmit={handleSubmit}>
      <FieldGroup class="gap-y-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <Field class="gap-2">
            <FieldLabel for="name-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
              <ShieldUser size={14} />
              Name
            </FieldLabel>
            <Input
              id="name-{id}"
              type="name"
              name="name"
              placeholder="Google Personal"
              required
            />
          </Field>
          <Field class="gap-2">
            <FieldLabel for="username-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
              <UserRound size={14} />
              Username
            </FieldLabel>
            <Input
              id="username-{id}"
              type="text"
              name="username"
              placeholder="john51"
            />
          </Field>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <Field class="gap-2">
            <FieldLabel for="email-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
              <Mail size={14} />
              Email
            </FieldLabel>
            <Input
              id="email-{id}"
              type="email"
              name="email"
              placeholder="m@example.com"
            />
          </Field>
          <Field class="gap-2">
            <FieldLabel for="password-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
              <KeySquare size={14} />
              Password
            </FieldLabel>
            <Input id="password-{id}" name="password" type="password" />
          </Field>
        </div>

        <Field class="gap-2">
          <FieldLabel for="websiteUrl-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
            <Globe size={14} />
            Website URL
          </FieldLabel>
          <Input id="websiteUrl-{id}" name="websiteUrl" type="text" placeholder="https://example.com" />
        </Field>

        <Field class="gap-2">
          <FieldLabel for="category-{id}" class="text-sm font-semibold">Category</FieldLabel>
          <CategoryDropdown />
        </Field>
      </FieldGroup>

      <div class="flex items-center justify-end gap-3 border-t border-white/35 pt-4">
        <Button type="button" variant="ghost" onclick={closeDrawer}>Cancel</Button>
        <Button disabled={loading} type="submit" class="inline-flex items-center gap-2">
          <Plus size={15} />
          {loading ? "Adding..." : "Add Credential"}
        </Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>
