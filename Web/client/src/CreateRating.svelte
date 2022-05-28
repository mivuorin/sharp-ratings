<script>
  import Paper from '@smui/paper';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Button, { Label } from '@smui/button';

  import { onMount } from 'svelte';
  import { postRating } from './Api';
  import { createForm } from 'svelte-forms-lib';
  import * as yup from 'yup';

  let titleInput;
  let promise = undefined;

  const { form, errors, handleChange, handleSubmit } = createForm({
    initialValues: {
      title: '',
      body: '',
    },
    validationSchema: yup.object({
      title: yup
        .string()
        .required('Please enter review title.')
        .max(140, 'Please shorten title to fit into ${max} characters.'),
      body: yup.string().required('Please enter review body text.'),
    }),
    onSubmit: (values) => {
      promise = postRating({ title: values.title, body: values.body });
    },
  });

  onMount(() => titleInput.focus());
</script>

<Paper>
  <form on:submit|preventDefault={handleSubmit}>
    <Textfield
      label="Tech name"
      input$name="title"
      bind:this={titleInput}
      bind:value={$form.title}
      bind:invalid={$errors.title}
      on:change={handleChange}
      on:blur={handleChange}
    >
      <HelperText validationMsg={$errors.title} slot="helper">
        {#if $errors.title}
          {$errors.title}
        {:else}
          Name of the tech. Should fit in 140 chars.
        {/if}
      </HelperText>
    </Textfield>
    <Textfield
      label="Review about tech?"
      input$name="body"
      textarea
      bind:value={$form.body}
      bind:invalid={$errors.body}
      on:change={handleChange}
      on:blur={handleChange}
    >
      <HelperText validationMsg={$errors.body} slot="helper">
        {#if $errors.body}
          {$errors.body}
        {:else}
          Explain why tech in question is good or bad?
        {/if}
      </HelperText>
    </Textfield>

    <Button variant="raised">
      <Label>Submit</Label>
    </Button>
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
</Paper>
