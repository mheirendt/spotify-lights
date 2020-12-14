<template>
  <div class="user-auth">
    <h1>Log in to Spotify using Authorization Code flow</h1>
    <a :href="`${url}`" class="btn btn-primary">Log in with Spotify</a><br />
  </div>
</template>

<script>
export default {
  data: () => ({
    url: `/api/login`,
  }),
};
</script>