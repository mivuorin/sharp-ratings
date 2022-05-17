<script>
  import Ratings from './Ratings.svelte';
  import CreateRating from './CreateRating.svelte';

  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from '@smui/top-app-bar';

  let topAppBar;
</script>

<TopAppBar variant="fixed" bind:this={topAppBar}>
  <Row>
    <Section>
      <Title>Sharp Ratings</Title>
    </Section>
  </Row>
</TopAppBar>

<AutoAdjust {topAppBar}>
  <main>
    <Ratings />
    <CreateRating />
  </main>
</AutoAdjust>
