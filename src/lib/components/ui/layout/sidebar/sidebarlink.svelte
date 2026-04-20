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
  class="flex gap-2 items-center p-2 font-medium rounded-sm {isActive
    ? 'border border-gray-50 bg-gray-200 opacity-100'
    : 'opacity-60'}"
  {href}
>
  <Icon size={18} />
  <span>{title}</span>
</a>
