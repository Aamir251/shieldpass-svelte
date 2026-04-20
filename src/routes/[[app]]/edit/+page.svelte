<script lang="ts">
  import { FieldGroup, Field, FieldLabel } from "$lib/components/ui/field";
  import Input from "$lib/components/ui/input/input.svelte";
  import CategoryDropdown from "$lib/components/credential/category-dropdown.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { Credential } from "$lib/components/credential";
import {
    encryptCredentialPassword,
    getEncryptionKeyFromLocalStorage,
  } from "$lib/utils/cipher.js";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  const id = $props.id();

  let loading: boolean = $state(false);

  const { data } = $props();

  const credential: Credential = $derived(data.credential!);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const credentialUpdates: any = {};

    // encyrpt credential password

    const password = formData.get("password");
    let encryptedPassword;
    if (password) {
      const encryptionKey = await getEncryptionKeyFromLocalStorage();

      encryptedPassword = await encryptCredentialPassword(
        password as string,
        encryptionKey!,
      );

      credentialUpdates.password = encryptedPassword;
    }

    const fields = ["name", "username", "email", "websiteUrl", "category"];

    fields.forEach((field) => {
      if (
        formData.get(field) !== "" &&
        // @ts-ignore
        formData.get(field) !== credential[field]
      ) {
        credentialUpdates[field] = formData.get(field);
      } else {
        formData.delete(field);
      }
    });

    try {
      const resp = await fetch("/api/update-credential", {
        method: "POST",
        body: JSON.stringify({
          id: credential.id,
          credential: credentialUpdates,
        }),
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

      toast.success("Credential Updated!");
    } catch (err: any) {}
  };
</script>

<section class="mt-10">
  <form onsubmit={handleSubmit}>
    <FieldGroup class="gap-y-5 max-w-xl">
      <h2 class="text-lg font-medium">Edit Credential</h2>
      <div class="flex gap-x-6">
        <Field>
          <FieldLabel for="email-{id}">Name</FieldLabel>
          <Input
            id="name-{id}"
            type="name"
            name="name"
            placeholder="Google Personal"
            required
            value={credential.name}
          />
        </Field>
        <Field>
          <FieldLabel for="username-{id}">Username</FieldLabel>
          <Input
            id="username-{id}"
            type="text"
            name="username"
            placeholder="John51"
            value={credential.username}
          />
        </Field>
      </div>
      <div class="flex gap-x-6">
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>
          <Input
            id="email-{id}"
            type="email"
            name="email"
            placeholder="m@example.com"
            value={credential.email}
          />
        </Field>
        <Field>
          <FieldLabel for="password-{id}">Password</FieldLabel>
          <Input id="password-{id}" name="password" type="password" />
        </Field>
      </div>
      <Field>
        <FieldLabel for="websiteUrl-{id}">Website Url</FieldLabel>
        <Input
          id="websiteUrl-{id}"
          name="websiteUrl"
          type="text"
          value={credential.websiteUrl}
        />
      </Field>
      <Field>
        <FieldLabel for="websiteUrl-{id}">Category</FieldLabel>
        <CategoryDropdown existingValue={credential.category} />
      </Field>
      <Field class="flex w-max mx-auto">
        <Button disabled={loading} type="submit">
          {loading ? "Please wait..." : "Update Credential"}
        </Button>
      </Field>
    </FieldGroup>
  </form>
</section>
