<template>
  <v-footer color="primary" dark absolute bottom>
    <v-btn
      v-if="playback"
      icon
      @click="playing ? pause() : play()"
      :loading="loading"
    >
      <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
    </v-btn>
    <span v-if="currentlyPlaying">{{ currentlyPlaying }}</span>
  </v-footer>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    devices: undefined,
    playback: undefined,
    loading: false,
  }),
  computed: {
    device() {
      return (this.devices && this.devices[0].id) || undefined;
    },
    playing() {
      return this.playback && this.playback.is_playing;
    },
    currentlyPlaying() {
      if (!this.playback) return;
      return `${this.playback.item.name} - ${this.playback.item.artists
        .map((a) => a.name)
        .join(", ")}`;
    },
  },
  async created() {
    this.devices = (
      await axios.get(`https://api.spotify.com/v1/me/player/devices`, {
        headers: {
          Authorization: "Bearer " + this.$route.query.access_token,
        },
      })
    ).data.devices;
    await this.updatePlayback();
  },
  methods: {
    async pause() {
      await axios.put(
        `https://api.spotify.com/v1/me/player/pause`,
        {},
        {
          params: { device_id: this.device },
          headers: {
            Authorization: "Bearer " + this.$route.query.access_token,
          },
        }
      );
      await this.updatePlayback();
    },
    async play(options) {
      this.loading = true;
      try {
        await axios.put(
          "https://api.spotify.com/v1/me/player/play",
          options || {},
          {
            params: { device_id: this.device },
            headers: {
              Authorization: "Bearer " + this.$route.query.access_token,
            },
          }
        );
        await new Promise((resolve) => {
          setTimeout(() => resolve(), 50);
        });
        await this.updatePlayback();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async updatePlayback() {
      this.playback = (
        await axios.get("https://api.spotify.com/v1/me/player", {
          headers: {
            Authorization: "Bearer " + this.$route.query.access_token,
          },
        })
      ).data;
    },
  },
};
</script>