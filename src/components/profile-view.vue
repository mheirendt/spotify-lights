<template>
  <div v-if="this.user">
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Spotify"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="../assets/Spotify_Logo_CMYK_White.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon color="white" :size="38">mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item to="/login">Logout</v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <track-visualizer />
    <v-menu
      v-model="showLibrary"
      top
      offset-y
      origin="bottom right"
      right
      transition="scale-transition"
      :close-on-content-click="false"
      :max-height="500"
      :min-width="400"
    >
      <template #activator="{ on }">
        <v-btn v-on="on" fab dark fixed bottom right :offset-top="100"
          ><v-icon>mdi-music</v-icon></v-btn
        >
      </template>
      <user-tracks
        v-if="tracks"
        :loading="loading"
        @page="updateTracks($event)"
        @select="trackSelected($event)"
        :tracks="tracks"
        :count="totalTracks"
      />
    </v-menu>
    <device-playback ref="playback" />
  </div>
</template>

<script>
import axios from "axios";
import UserTracks from "./user-tracks";
import Mutations from "../store/mutations";
import Getters from "../store/getters";
import DevicePlayback from "./device-playback";
import TrackVisualizer from "./track-visualizer.vue";
export default {
  components: { UserTracks, DevicePlayback, TrackVisualizer },
  data: () => ({
    tracks: [],
    totalTracks: 0,
    loading: true,
    showLibrary: false,
  }),
  computed: {
    user() {
      return this.$store.getters[Getters.USER];
    },
  },
  methods: {
    logOut() {
      this.$store.commit(Mutations.USER, null);
      this.$router.push({ name: "Login" });
    },
    async updateTracks(page = 1) {
      const itemsPerPage = 20;
      const query = {
        limit: itemsPerPage,
        offset: itemsPerPage * (page - 1),
      };
      const tracks = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
        params: query,
      });
      this.totalTracks = tracks.data.total;
      this.tracks = [...this.tracks, ...tracks.data.items];
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
        this.$store.commit(Mutations.USER, response.data);
      } catch (e) {
        console.warn(e);
        this.$router.push({ name: "Login" });
      }
    }
  },
};
</script>
