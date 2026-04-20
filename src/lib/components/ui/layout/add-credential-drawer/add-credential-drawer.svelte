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

  const id = $props.id();

  let loading = $state<boolean>(false);

  const closeDrawer = () => {
    window.history.back();
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
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
    }
  };
</script>

<div
  onclick={closeDrawer}
  class="fixed inset-0 w-screen h-screen bg-black/30 z-10"
></div>

<Card.Root
  class="overflow-hidden rounded-none border-none fixed top-0 right-0 z-20 bg-gray-50 shadow-sm h-screen w-xl p-3"
>
  <Card.Content>
    <form id="credential-form" class="p-6 md:p-8" onsubmit={handleSubmit}>
      <FieldGroup class="gap-y-5">
        <h2 class="text-lg font-medium">Add Credential</h2>
        <Field>
          <FieldLabel for="email-{id}">Name</FieldLabel>
          <Input
            id="name-{id}"
            type="name"
            name="name"
            placeholder="Google Personal"
            required
          />
        </Field>
        <Field>
          <FieldLabel for="username-{id}">Username</FieldLabel>
          <Input
            id="username-{id}"
            type="text"
            name="username"
            placeholder="John51"
          />
        </Field>
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>
          <Input
            id="email-{id}"
            type="email"
            name="email"
            placeholder="m@example.com"
          />
        </Field>
        <Field>
          <FieldLabel for="password-{id}">Password</FieldLabel>
          <Input id="password-{id}" name="password" type="password" />
        </Field>
        <Field>
          <FieldLabel for="websiteUrl-{id}">Website Url</FieldLabel>
          <Input id="websiteUrl-{id}" name="websiteUrl" type="text" />
        </Field>
        <Field>
          <FieldLabel for="websiteUrl-{id}">Category</FieldLabel>
          <CategoryDropdown />
        </Field>
        <Field>
          <Button disabled={loading} type="submit">
            {loading ? "Please wait..." : "Add Credential"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
