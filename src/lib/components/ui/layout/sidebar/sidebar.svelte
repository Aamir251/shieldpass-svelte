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

  let isOpen: boolean = $state(false);
</script>

<aside
  class="w-10/12 max-lg:fixed {isOpen ? 'left-0' : '-left-full'} top-0 bg-card/70 backdrop-blur-xl max-lg:h-screen max-lg:pt-10 lg:w-64 px-2 border border-border/40"
>
  <ul class="space-y-2">
    {#each items as item}
      {@const Icon = item.icon}
      <Sidebarlink {Icon} href={item.href} title={item.title} />
    {/each}
  </ul>
</aside>
