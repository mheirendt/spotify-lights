<template>
  <v-footer color="primary" dark absolute bottom v-if="track.name">
    <div class="d-flex align-self-center" style="min-width: 200px">
      <v-img
        :src="track.images[2].url"
        contain
        :max-height="60"
        :max-width="60"
      />
      <div class="d-flex flex-column pl-2 align-self-center">
        <div>{{ track.name }}</div>
        <div>{{ track.artist }}</div>
      </div>
    </div>
    <v-spacer style="max-width: 100px" />
    <div class="d-flex flex-grow-1 flex-column">
      <div class="d-flex justify-center">
        <v-btn icon @click="previous()" :disabled="loading">
          <v-icon>mdi-undo</v-icon>
        </v-btn>
        <v-btn icon @click="playing ? pause() : play()" :disabled="loading">
          <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
        </v-btn>
        <v-btn icon @click="next()" :disabled="loading">
          <v-icon>mdi-redo</v-icon>
        </v-btn>
      </div>
      <track-slider
        v-if="progress"
        :progress="progress"
        :duration="track.duration"
        :on-seek="seek"
        color="secondary"
      />
    </div>
    <v-spacer style="max-width: 300px" />
  </v-footer>
</template>

<script>
import axios from "axios";
import Mutations from "../store/mutations";
import Getters from "../store/getters";
import trackSlider from "./track-slider.vue";
export default {
  components: { trackSlider },
  data: () => ({
    devices: undefined,
    loading: false,
    subscriptions: [],
    now: new Date(),
    latency: 0,
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
    progress() {
      return this.$store.getters[Getters.PROGRESS];
    },
    playing() {
      return this.track && !this.track.paused;
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
        function () {
          this.updateProgress();
        }.bind(this),
        250
      )
    );

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
    async previous() {
      this.loading = true;
      await axios.post("https://api.spotify.com/v1/me/player/previous");
      await this.updatePlayback();
      this.loading = false;
    },
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
    async next() {
      this.loading = true;
      await axios.post("https://api.spotify.com/v1/me/player/next");
      await this.updatePlayback();
      this.loading = false;
    },
    async seek(progress) {
      this.loading = true;
      await axios.put(
        "https://api.spotify.com/v1/me/player/seek",
        {},
        {
          params: { position_ms: progress },
        }
      );
      await this.updatePlayback();
      this.loading = false;
    },
    updateProgress() {
      this.now = new Date();
      if (!this.track || !this.track.name) return undefined;
      // Destructure the info we need from the track
      let { duration, timestamp, progress, paused } = this.track;

      // The api is polled every XX seconds, so we need to offset the
      // progress with the timestamp of when the data was requrested
      if (!paused && progress <= duration) {
        progress = this.now - new Date(timestamp - progress);
      }
      if (progress !== this.progress && progress <= this.track.duration) {
        this.$store.commit(Mutations.PROGRESS, progress);
      }
    },
    async updatePlayback() {
      // const requestedAt = new Date();
      const response = await axios.get("https://api.spotify.com/v1/me/player");

      // issue: https://github.com/spotify/web-api/issues/1073
      // Best approximation is to get the time that the request took and divide it by 2
      // before subtracting it from the current time for the timestamp
      let timestamp = new Date() - this.latency;
      //   timespan = requestComplete - requestedAt;
      // let timestamp = new Date(requestComplete - timespan / 2);

      // If the difference between the timestamp & the current time is less than a second, it is probably an accurate latency
      const latency = timestamp - response.data.timestamp;
      if (latency < 1000) {
        this.latency = latency;
        timestamp = response.data.timestamp;
      }

      // Update the track analysis if we don't have it already, or if the track is new
      let analysis;
      if (response.data.item) {
        if (!this.track || response.data.item?.uri !== this.track.id) {
          const analysisResponse = await axios.get(
            `https://api.spotify.com/v1/audio-analysis/${response.data.item.id}`
          );
          analysis = analysisResponse.data;
        } else {
          analysis = this.track?.analysis;
        }
      }
      let track = {
        analysis,
        timestamp,
        progress: response.data.progress_ms,
        paused: !response.data.is_playing,
      };

      if (response.data.item) {
        Object.assign(track, {
          id: response.data.item.uri,
          name: response.data.item.name,
          artist: response.data.item.artists.map((m) => m.name).join(", "),
          album: response.data.item.album.name,
          images: response.data.item.album.images,
          duration: response.data.item.duration_ms,
        });
      }

      this.$store.commit(Mutations.TRACK, track);
    },
  },
};
</script>