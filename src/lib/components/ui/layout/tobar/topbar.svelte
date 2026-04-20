<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "../../button/button.svelte";
  import Input from "../../input/input.svelte";

  const handleClick = () => {
    goto(`${page.url.pathname}/new`);
  };
</script>

<div class="flex justify-between max-md:flex-col gap-y-4">
  <form class="flex gap-x-5 w-full">
    <Input placeholder="search credentials" class="max-w-96" />
    <Button type="submit" variant="default">Search</Button>
  </form>

  <Button onclick={handleClick}>Add Credential</Button>
</div>
