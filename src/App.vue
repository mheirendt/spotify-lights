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
        <v-icon>mdi-cast</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <profile-view />
    </v-main>
  </v-app>
</template>

<script>
import ProfileView from "./components/profile-view";

export default {
  name: "App",

  components: {
    ProfileView,
  },

  data: () => ({
    //
  }),
};
</script>
