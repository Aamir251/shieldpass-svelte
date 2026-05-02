<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "../../button/button.svelte";
  import Input from "../../input/input.svelte";

  const handleClick = () => {
    goto(`${page.url.pathname}/new`);
  };

  const handleSubmit = (e : SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = form.querySelector("input")!.value;

    const currentQuery = page.url.searchParams.get('q');

    goto(`/search?q=${encodeURIComponent(query)}`, {
      replaceState : currentQuery !== null
    });
  };

  const currentQuery = page.url.searchParams.get('q');

</script>

<div class="flex justify-between max-md:flex-col gap-y-4">
  <form onsubmit={handleSubmit} class="flex gap-x-5 w-full">
    <Input placeholder="search credentials" class="max-w-xl" defaultValue={currentQuery} />
    <Button type="submit" variant="default">Search</Button>
  </form>

  <Button onclick={handleClick}>Add Credential</Button>
</div>
