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
  class="group relative flex w-full items-center gap-2 rounded-md border px-3.5 py-1.5 text-regular font-regular transition-all {isActive
    ? 'border-white/25 bg-white/20 text-foreground shadow-sm backdrop-blur-xl'
    : 'border-transparent text-muted-foreground hover:border-white/35 hover:bg-white/28 hover:text-foreground hover:backdrop-blur-lg'}"
  {href}
>
  <span
    class="inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all {isActive
      ? 'border-white/35 bg-white/45 text-foreground'
      : 'border-white/25 bg-white/15 text-muted-foreground group-hover:border-white/40 group-hover:bg-white/30 group-hover:text-foreground'}"
  >
    <Icon size={15} />
  </span>
  <span>{title}</span>

  {#if isActive}
    <span class="ml-auto h-2 w-2 rounded-full bg-sky-400/60 shadow-[0_0_0_6px_rgba(14,165,233,0.07)]"></span>
  {/if}
</a>
