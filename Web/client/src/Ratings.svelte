<script>
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import { getRatings } from './Api';
</script>

<Paper>
  <Title>Best rated tech!</Title>
  <Subtitle>
    Here's some carefully curated and opionated reviews about various tech.
  </Subtitle>
  <Content>
    {#await getRatings()}
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
  </Content>
</Paper>
