<template>
  <div v-if="this.user">
    <v-menu
      v-model="showLibrary"
      top
      offset-y
      :nudge-bottom="22.5"
      origin="bottom right"
      transition="scale-transition"
      :close-on-content-click="false"
      :max-height="500"
    >
      <template #activator="{ on }">
        <v-btn v-on="on" fab dark fixed bottom right :offset-top="100"
          ><v-icon>mdi-music</v-icon></v-btn
        >
      </template>
      <v-card>
        <user-tracks
          v-if="tracks"
          :loading="loading"
          :count="tracks.data.total"
          @page="updateTracks($event)"
          @select="trackSelected($event)"
          :tracks="tracks.data.items"
        />
      </v-card>
    </v-menu>
    <device-playback ref="playback" />
  </div>
</template>

<script>
import axios from "axios";
import UserTracks from "./user-tracks";
import DevicePlayback from "./device-playback";
export default {
  components: { UserTracks, DevicePlayback },
  data: () => ({
    tracks: undefined,
    loading: true,
    showLibrary: false,
  }),
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Login" });
    },
    async updateTracks(pagination) {
      let query;
      if (pagination) {
        console.log(pagination);
        query = {
          limit: pagination.itemsPerPage,
          offset: pagination.itemsPerPage * (pagination.page - 1),
        };
      }
      this.tracks = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
        params: query,
      });
      this.loading = false;
    },
    async trackSelected(item) {
      await this.$refs.playback.play({ uris: [item.track.uri] });
      this.showLibrary = false;
    },
  },
  async mounted() {
    if (this.$route.query) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/me`);
        await this.updateTracks();
        this.$store.commit("mutateUser", response.data);
      } catch (e) {
        console.warn(e);
        this.$router.push({ name: "Login" });
      }
    }
  },
};
</script>
