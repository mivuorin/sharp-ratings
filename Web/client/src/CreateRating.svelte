<script>
  let title = '';
  let body = '';

  async function submit() {
    await fetch('/api/ratings', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
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
