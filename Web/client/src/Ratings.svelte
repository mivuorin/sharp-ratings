<script>
    async function getRatings() {
        const response = await fetch('/api/ratings')
        
        if(response.ok) {
            return await response.json()
        }
        
        throw new Error()
    }
</script>
<h1>Best rated tech!</h1>

{#await getRatings() }
  <div>Loading...</div>
{:then ratings}
  <div role="list">
    {#each ratings as rating}
      <div>
        <h2>{rating.title}</h2>
        <div role="listitem">
          {rating.body}
        </div>
      </div>
    {:else}
      <div>No ratings found :(</div>
    {/each}
  </div>
{:catch error}
  <div role="alert">Loading error!!!</div>
{/await}