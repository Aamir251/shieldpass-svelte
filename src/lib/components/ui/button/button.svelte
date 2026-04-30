<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default:
					"bg-white/45 text-foreground hover:bg-white/60 border border-white/60 dark:bg-white/12 dark:text-white dark:hover:bg-white/18 dark:border-white/20 backdrop-blur-xl shadow-xs",
				destructive:
					"bg-destructive/22 text-red-900 hover:bg-destructive/30 focus-visible:ring-destructive/25 border border-destructive/35 dark:text-red-100 backdrop-blur-xl shadow-xs",
				outline:
					"bg-white/22 text-foreground hover:bg-white/35 hover:text-foreground dark:bg-white/8 dark:text-white dark:hover:bg-white/14 border border-white/40 dark:border-white/20 backdrop-blur-xl shadow-xs",
				secondary:
					"bg-primary/12 text-foreground hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/16 border border-primary/20 dark:border-white/20 backdrop-blur-xl shadow-xs",
				ghost:
					"text-foreground hover:bg-white/25 hover:text-foreground dark:text-white dark:hover:bg-white/14 backdrop-blur-xl",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-xl px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-xl px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
