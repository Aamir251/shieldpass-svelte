<script lang="ts">
  import { page } from "$app/state";
  import { type IconProps } from "@lucide/svelte";
  import { type Component } from "svelte";
  let { Icon, title, href } = $props<{
    Icon: Component<IconProps, {}, "">;
    title: string;
    href: string;
  }>();

  const isActive = $derived(page.url.pathname === href);
</script>

<a
  class="flex gap-2 items-center p-2 font-medium rounded-xl transition-all {isActive
    ? 'border border-border/60 bg-input/50 backdrop-blur-md opacity-100'
    : 'opacity-70 hover:bg-input/40 hover:opacity-100'}"
  {href}
>
  <Icon size={18} />
  <span>{title}</span>
</a>
