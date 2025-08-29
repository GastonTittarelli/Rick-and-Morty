import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://rick-and-morty-blond-three.vercel.app/", // "http://localhost:4200/"
    setupNodeEvents(on, config) {
      
    },
  },
});
