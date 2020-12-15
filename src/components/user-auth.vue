<template>
  <div class="user-auth">
    <h1>Login</h1>
    <v-btn :href="url">
      <v-icon>mdi-spotify</v-icon><span>&nbsp;With Spotify</span>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    url: `/api/login`,
  }),
};
</script>