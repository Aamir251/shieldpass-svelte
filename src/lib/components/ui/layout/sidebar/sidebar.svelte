<script lang="ts">
  import {
    GalleryHorizontal,
    Landmark,
    MessageSquareMore,
    TabletSmartphone,
    Cloud,
    ShoppingCart,
    type IconProps,
  } from "@lucide/svelte";
  import Sidebarlink from "./sidebarlink.svelte";
  import type { Component } from "svelte";
  import type { CredentialCategory } from "$lib/utils/constants";

  type ItemType = {
    id: number;
    title: CredentialCategory;
    href: string;
    icon: Component<IconProps, {}, "">;
  };
  const items: ItemType[] = [
    { id: 0, title: "All", href: "/all", icon: GalleryHorizontal },
    { id: 1, title: "Finances", href: "/finances", icon: Landmark },
    { id: 2, title: "Socials", href: "/socials", icon: MessageSquareMore },
    { id: 3, title: "Cloud", href: "/cloud", icon: Cloud },
    { id: 4, title: "Apps", href: "/apps", icon: TabletSmartphone },
    { id: 5, title: "Ecommerce", href: "/ecommerce", icon: ShoppingCart },
  ];
</script>

<aside
  class="static hidden h-screen w-64 shrink-0 overflow-hidden border border-white/40 bg-card/70 p-4 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:flex lg:flex-col"
>
  <div class="absolute -left-12 -top-14 h-52 w-52 rounded-full bg-sky-300/30 blur-[120px]"></div>
  <div class="absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-violet-300/25 blur-[120px]"></div>

  <div class="relative z-10 flex h-full flex-col overflow-y-auto">
    <div class="rounded-2xl border border-white/40 bg-white/35 p-4 backdrop-blur-xl">
      <p class="text-xs font-semibold tracking-[0.16em] text-muted-foreground">SHIELD PASS</p>
      <p class="mt-1 text-xs text-muted-foreground">Your categories, secured and organized.</p>
    </div>

    <p class="mt-14 px-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground">CATEGORIES</p>

    <ul class="mt-2 space-y-1.5">
      {#each items as item}
        {@const Icon = item.icon}
        <Sidebarlink {Icon} href={item.href} title={item.title} />
      {/each}
    </ul>

  </div>
</aside>
