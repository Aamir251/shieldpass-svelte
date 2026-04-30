<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";

  const categories = [
    { value: "finances", label: "Finances" },
    { value: "socials", label: "Socials" },
    { value: "cloud", label: "Cloud" },
    { value: "apps", label: "App" },
    { value: "ecommerce", label: "Ecommerce" },
  ];

  let { existingValue = "" }: { existingValue?: string | null } = $props();

  let value = $state("");

  $effect(() => {
    value = existingValue ?? "";
  });

  const selectedCategory = $derived(
    categories.find((f) => f.value === value)?.label ?? "Select a Category",
  );
</script>

<Select.Root type="single" name="category" bind:value>
  <Select.Trigger class="w-45">
    {selectedCategory}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Category</Select.Label>
      {#each categories as category (category.value)}
        <Select.Item
          value={category.value}
          label={category.label}
          disabled={category.value === "grapes"}
        >
          {category.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
