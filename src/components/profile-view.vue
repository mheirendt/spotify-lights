<template>
  <div v-if="this.user" class="profile-view">
    <v-hover v-slot="{ hover }" :disabled="pinned" :close-delay="500">
      <v-app-bar
        app
        color="primary"
        dark
        :extension-height="pinned || hover ? undefined : 0"
      >
        <v-img
          alt="Spotify"
          class="shrink mt-1"
          contain
          min-width="100"
          src="../assets/Spotify_Logo_CMYK_White.png"
          width="100"
        />

        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn v-on="on" icon>
              <v-icon :size="38">mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item to="/login">Logout</v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <template #extension>
          <v-tabs>
            <v-spacer />
            <v-tab link to="visualize">Visualize</v-tab>
            <v-tab link to="setup">Setup</v-tab>
            <v-spacer />
            <v-btn bottom left icon @click="pinned = !pinned" class="mr-1">
              <v-icon>{{
                pinned ? "mdi-pin-outline" : "mdi-pin-off-outline"
              }}</v-icon>
            </v-btn>
          </v-tabs>
        </template>
      </v-app-bar>
    </v-hover>
    <router-view />
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

<style lang="scss">
.profile-view {
  .v-toolbar__extension,
  .v-toolbar--extended {
    transition: height 0.15s ease-out;
  }
}
</style>

<script>
import axios from "axios";
import UserTracks from "./user-tracks";
import Mutations from "../store/mutations";
import Getters from "../store/getters";
import DevicePlayback from "./device-playback";
export default {
  components: { UserTracks, DevicePlayback },
  data: () => ({
    tracks: [],
    totalTracks: 0,
    loading: true,
    showLibrary: false,
    pinned: true,
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
      const response = await axios.get(`https://api.spotify.com/v1/me`);
      await this.updateTracks();
      this.$store.commit(Mutations.USER, response.data);
    }
  },
};
</script>
