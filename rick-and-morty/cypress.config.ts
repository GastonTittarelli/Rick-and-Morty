import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200/", // "https://rick-and-morty-blond-three.vercel.app/",
    setupNodeEvents(on, config) {
      
    },
  },
});
