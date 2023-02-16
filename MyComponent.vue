<!-- MyComponent.vue -->
<template>
  <div>
    <button @click="toggleTheme">Toggle theme</button>
    <div :class="{ 'is-selected': $store.state.ui.theme === 'light' }">Light theme</div>
    <div :class="{ 'is-selected': $store.state.ui.theme === 'dark' }">Dark theme</div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleTheme() {
      if (this.$store.state.ui.theme === 'light') {
        this.$store.commit('setTheme', 'dark');
      } else {
        this.$store.commit('setTheme', 'light');
      }
    },
  },
};
</script>