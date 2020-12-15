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
import Mutations from "../store/mutations";
import Getters from "../store/getters";
export default {
  data: () => ({
    devices: undefined,
    loading: false,
    unsubscribe: undefined,
    analysis: undefined,
  }),
  computed: {
    device() {
      return (
        (this.devices && this.devices.length && this.devices[0].id) || undefined
      );
    },
    playback() {
      return this.$store.getters[Getters.PLAYBACK];
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
  watch: {
    async playback(playback, old) {
      if (!playback.item || (old && playback.item.uri === old.item.uri)) return;
      this.analysis = await axios.get(
        `https://api.spotify.com/v1/audio-analysis/${playback.item.id}`
      );
    },
  },
  async created() {
    this.devices = (
      await axios.get(`https://api.spotify.com/v1/me/player/devices`)
    ).data.devices;
    if (!this.devices.length) {
      alert("You must begin a session on a device");
    }
    await this.updatePlayback();
    this.subscription = setInterval(
      async function () {
        await this.updatePlayback();
      }.bind(this),
      10000
    );
  },
  beforeDestroy() {
    clearInterval(this.subscription);
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
          setTimeout(() => resolve(), 200);
        });
        await this.updatePlayback();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async updatePlayback() {
      const response = await axios.get("https://api.spotify.com/v1/me/player");
      if (
        this.playback &&
        response.data.is_playing === this.playback.is_playing &&
        response.data.item.id === this.playback.item.id
      )
        return;

      this.$store.commit(Mutations.PLAYBACK, response.data);
    },
  },
};
</script>