<script lang="ts">
  import { FieldGroup, Field, FieldLabel } from "$lib/components/ui/field";
  import Input from "$lib/components/ui/input/input.svelte";
  import CategoryDropdown from "$lib/components/credential/category-dropdown.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import type { Credential } from "$lib/components/credential";
  import {
    encryptCredentialPassword,
    getEncryptionKeyFromLocalStorage,
  } from "$lib/utils/cipher.js";
  import { toast } from "svelte-sonner";
  import { ChevronLeft, Globe, KeySquare, Mail, Save, ShieldUser, UserRound } from "@lucide/svelte";
    import { goto } from "$app/navigation";
  const id = $props.id();

  let loading: boolean = $state(false);

  const { data } = $props();

  const credential: Credential = $derived(data.credential!);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    loading = true;
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
    finally {
      loading = false;
    }
  };
</script>

<section class="mt-8 pb-8 h-[calc(100vh-160px)] lg:h-[calc(100vh-110px)] overflow-y-hidden ">
  <div class="relative overflow-hidden rounded-3xl border border-white/40 bg-card/65 p-3 md:p-6 backdrop-blur-2xl shadow-[0_20px_70px_rgba(15,23,42,0.025)] sm:p-8">
    <div class="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-sky-300/35 blur-[120px]"></div>
    <div class="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-violet-300/30 blur-[120px]"></div>

    <div class="relative z-10 max-w-5xl max-lg:max-h-[calc(100vh-200px)] h-full overflow-y-auto">
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <!-- <p class="text-xs font-semibold tracking-[0.16em] text-muted-foreground">CREDENTIAL MANAGEMENT</p> -->
          <h1 class="mt-1 text-2xl font-semibold text-foreground">Edit Credential</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Update details for <span class="font-medium text-foreground">{credential.name}</span> securely.
          </p>
        </div>

        <Button variant="outline" onclick={() => history.back()} class="inline-flex items-center gap-2">
          <ChevronLeft size={16} />
          Back
        </Button>
      </div>

      <Card.Root class="border-white/45 bg-white/24 backdrop-blur-xl">
        <Card.Content class="px-3 py-5 sm:px-6 sm:py-6">
          <form onsubmit={handleSubmit} class="space-y-5">
            <FieldGroup class="gap-y-5">
              <div class="grid gap-4 md:grid-cols-2">
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
                    value={credential.name}
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
                    placeholder="John51"
                    value={credential.username}
                  />
                </Field>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
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
                    value={credential.email}
                  />
                </Field>

                <Field class="gap-2">
                  <FieldLabel for="password-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
                    <KeySquare size={14} />
                    New Password
                  </FieldLabel>
                  <Input id="password-{id}" name="password" type="password" placeholder="Leave empty to keep current password" />
                </Field>
              </div>

              <Field class="gap-2">
                <FieldLabel for="websiteUrl-{id}" class="inline-flex items-center gap-2 text-sm font-semibold">
                  <Globe size={14} />
                  Website URL
                </FieldLabel>
                <Input
                  id="websiteUrl-{id}"
                  name="websiteUrl"
                  type="text"
                  placeholder="https://example.com"
                  value={credential.websiteUrl}
                />
              </Field>

              <Field class="gap-2">
                <FieldLabel for="category-{id}" class="text-sm font-semibold">Category</FieldLabel>
                <CategoryDropdown existingValue={credential.category ?? ""} />
              </Field>
            </FieldGroup>

            <div class="flex flex-wrap items-center justify-end gap-3 border-t border-white/35 pt-4">
              <Button type="button" variant="ghost" onclick={() => history.back()}>
                Cancel
              </Button>
              <Button disabled={loading} type="submit" class="inline-flex items-center gap-2">
                <Save size={15} />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</section>
