<script>
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

<form on:submit|preventDefault={handleSubmit}>
  <label for="create-rating-title">Tech name</label>
  <input
    id="create-rating-title"
    type="text"
    name="title"
    bind:this={titleInput}
    on:change={handleChange}
    on:blur={handleChange}
    bind:value={$form.title}
  />
  {#if $errors.title}
    <div>{$errors.title}</div>
  {/if}

  <label for="create-rating-body">Review about tech?</label>
  <textarea
    id="create-rating-body"
    name="body"
    on:change={handleChange}
    on:blur={handleChange}
    bind:value={$form.body}
  />
  {#if $errors.body}
    <div>{$errors.body}</div>
  {/if}

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
