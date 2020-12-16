<template>
  <v-footer color="primary" dark absolute bottom>
    <v-btn
      v-if="track"
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
    subscriptions: [],
  }),
  computed: {
    device() {
      return (
        (this.devices && this.devices.length && this.devices[0].id) || undefined
      );
    },
    track() {
      return this.$store.getters[Getters.TRACK];
    },
    playing() {
      return this.track && !this.track.paused;
    },
    currentlyPlaying() {
      if (!this.track) return;
      return `${this.track.name} - ${this.track.artist}`;
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

    this.subscriptions.push(
      setInterval(
        async function () {
          await this.updatePlayback();
        }.bind(this),
        10000
      )
    );
  },
  beforeDestroy() {
    this.subscriptions.forEach((subscription) => clearInterval(subscription));
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
          setTimeout(() => resolve(), 300);
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
      let analysis;
      if (response.data.item?.uri !== this.track?.id) {
        const analysisResponse = await axios.get(
          `https://api.spotify.com/v1/audio-analysis/${response.data.item.id}`
        );
        analysis = analysisResponse.data;
      } else {
        analysis = this.track?.analysis;
      }

      this.$store.commit(Mutations.TRACK, {
        id: response.data.item.uri,
        analysis,
        progress: response.data.progress_ms,
        timestamp: new Date().getTime(), //response.data.timestamp, // why spotify not update this each request??
        duration: response.data.item.duration_ms,
        paused: !response.data.is_playing,
        name: response.data.item.name,
        artist: response.data.item.artists.map((m) => m.name).join(", "),
        album: response.data.item.album.name,
      });
    },
  },
};
</script>