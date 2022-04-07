import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'Mikko',
  },
});

export default app;
