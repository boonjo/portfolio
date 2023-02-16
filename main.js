// Add an event listener to the navigation links to highlight the selected link
const navLinks = document.querySelectorAll('.siteHeader_nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((otherLink) => {
      otherLink.classList.remove('is-selected');
    });
    link.classList.add('is-selected');
  });
});

// Create a Vue app to toggle the theme
const app = Vue.createApp({
  data() {
    return {
      ui: {
        theme: 'light',
      },
    };
  },
  methods: {
    toggleTheme() {
      this.ui.theme = this.ui.theme === 'light' ? 'dark' : 'light';
    },
  },
});

// Mount the Vue app to the #Theme element
app.mount('#Theme');