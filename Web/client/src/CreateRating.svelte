<script>
  import { postRating } from './Api';

  let title = '';
  let body = '';

  let promise = undefined;

  async function submit() {
    promise = postRating({
      title: title,
      body: body,
    });
  }
</script>

<form on:submit|preventDefault={submit}>
  <label for="create-rating-title">Tech name</label>
  <input id="create-rating-title" type="text" bind:value={title} />

  <label for="create-rating-body">Review about tech?</label>
  <textarea id="create-rating-body" bind:value={body} />

  <input type="submit" value="Submit" />
</form>

{#if promise}
  {#await promise}
    <div>Loading...</div>
  {:then _}
    <div>Rating created successfully.</div>
  {:catch _}
    <div>Creating new rating failed!</div>
  {/await}
{/if}
