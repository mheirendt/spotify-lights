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
      return (
        (this.devices && this.devices.length && this.devices[0].id) || undefined
      );
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
      await axios.get(`https://api.spotify.com/v1/me/player/devices`)
    ).data.devices;
    if (!this.devices.length) {
      console.error("You must begin a session on a device");
    }
    await this.updatePlayback();
    setInterval(
      async function () {
        await this.updatePlayback();
      }.bind(this),
      3000
    );
  },
  methods: {
    async pause() {
      await axios.put(
        `https://api.spotify.com/v1/me/player/pause`,
        {},
        {
          params: { device_id: this.device },
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
          }
        );
        await new Promise((resolve) => {
          setTimeout(() => resolve(), 125);
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
        await axios.get("https://api.spotify.com/v1/me/player")
      ).data;
    },
  },
};
</script>