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
        !response.data.item ||
        (this.track &&
          response.data.item.uri === this.track.id &&
          this.track &&
          !response.data.is_playing === this.track.paused)
      )
        return;

      const analysis = await axios.get(
        `https://api.spotify.com/v1/audio-analysis/${response.data.item.id}`
      );

      const started = new Date(
        response.data.timestamp - response.data.progress_ms
      );
      console.log(response.data.is_playing, response.data);
      this.$store.commit(Mutations.TRACK, {
        id: response.data.item.uri,
        analysis: analysis.data, // TODO: change analysis to a standard format
        started,
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