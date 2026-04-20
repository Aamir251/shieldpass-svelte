<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
    import { signUpMiddleware } from "$lib/utils/forms";

  let {
    class: className,
    form,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & {
    form: any;
  } = $props();

  let loading = $state<boolean>(false);

  const id = $props.id();

  $effect(() => {
    if (form?.message) {
      toast.error(form.message);
    }
  });

  const useEnhanceSubmit = async (event: any) => {
    loading = true;
    await signUpMiddleware(event.formData);

    event.formData.delete("confirmPassword");

    return async ({ update }) => {
      await update();
      loading = false;
    };
  };
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <Card.Root class="overflow-hidden p-0">
    <Card.Content class="grid p-0 md:grid-cols-2">
      <form class="p-6 md:p-8" method="post" use:enhance={useEnhanceSubmit}>
        <FieldGroup>
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-bold">Welcome back</h1>
            <p class="text-muted-fore••••••••••ground text-balance">
              Login to your Acme Inc account
            </p>
          </div>
          <Field>
            <FieldLabel for="name-{id}">Name</FieldLabel>
            <Input
              id="name-{id}"
              type="name"
              name="name"
              placeholder="Robert Johnson"
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
            <Input
              id="password-{id}"
              name="password"
              type="password"
              required
            />
          </Field>
          <Field>
            <FieldLabel for="confirm-password-{id}">Confirm Password</FieldLabel
            >
            <Input
              id="confirm-password-{id}"
              name="confirmPassword"
              type="password"
              required
            />
          </Field>
          <Field>
            <FieldLabel for="schoolName-{id}"
              >School Name <span class="text-xs leading-tight text-gray-500"
                >(For Security Purpose)</span
              >
            </FieldLabel>
            <Input
              id="schoolName-{id}"
              name="schoolName"
              type="text"
              required
            />
          </Field>
          <Field>
            <Button
              disabled={loading}
              class={`${loading && "opacity-60"}`}
              type="submit"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Field>
          <FieldDescription class="text-center">
            Already have an account? <a href="/login">Login</a>
          </FieldDescription>
        </FieldGroup>
      </form>
      <div class="bg-muted relative hidden md:block">
        <img
          src="/images/form-bg.jpg"
          alt="placeholder"
          class="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </Card.Content>
  </Card.Root>
  <FieldDescription class="px-6 text-center">
    By clicking continue, you agree to our <a href="##">Terms of Service</a> and
    <a href="##">Privacy Policy</a>.
  </FieldDescription>
</div>
