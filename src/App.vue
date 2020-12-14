<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Spotify"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="./assets/Spotify_Logo_CMYK_White.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-profile</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>
