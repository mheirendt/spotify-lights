<template>
  <v-footer color="primary" dark absolute bottom v-if="track && track.name">
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
        <v-btn
          icon
          @click="toggleShuffle()"
          :color="track.shuffle ? 'accent' : undefined"
          :disabled="loading"
        >
          <v-icon>mdi-shuffle-variant</v-icon>
        </v-btn>
        <div class="mx-6">
          <v-btn icon @click="previous()" :disabled="loading">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn icon @click="playing ? pause() : play()" :disabled="loading">
            <v-icon :size="42">{{
              playing ? "mdi-pause-circle-outline" : "mdi-play-circle-outline"
            }}</v-icon>
          </v-btn>
          <v-btn icon @click="next()" :disabled="loading">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </div>
        <v-btn
          icon
          @click="toggleRepeat()"
          :disabled="loading"
          :color="track.repeat ? 'accent' : undefined"
        >
          <v-icon>mdi-repeat</v-icon>
        </v-btn>
      </div>
      <track-slider
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
import SpotifyService from "../services/spotify";
export default {
  components: { trackSlider },
  data: () => ({
    devices: undefined,
    loading: false,
    subscriptions: [],
    now: new Date(),
    latency: 0,
    service: SpotifyService,
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
      return this.$store.getters[Getters.PROGRESS] || 0;
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
    async toggleShuffle() {
      this.loading = true;
      await this.service.shuffle(!this.track.shuffle);
      await this.updatePlayback();
      this.loading = false;
    },
    async previous() {
      this.loading = true;
      if (this.progress > 15000) {
        await this.service.seek(0);
      } else {
        await this.service.previous();
      }
      await this.updatePlayback();

      this.loading = false;
    },
    async pause() {
      this.loading = true;
      await this.service.pause();
      await this.updatePlayback();
      this.loading = false;
    },
    async play() {
      this.loading = true;
      await this.service.play();

      // Play to device is asynchronous
      // Wait for a little and hopefully things are in sync
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 300);
      });
      await this.updatePlayback();
      this.loading = false;
    },
    async next() {
      this.loading = true;
      await this.service.next();
      await this.updatePlayback();
      this.loading = false;
    },
    async seek(progress) {
      this.loading = true;
      await this.service.seek(progress);
      await this.updatePlayback();
      this.loading = false;
    },
    async toggleRepeat() {
      this.loading = true;
      await this.service.repeat(!this.track.repeat);
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
      const track = await this.service.info();
      this.$store.commit(Mutations.TRACK, track);
    },
  },
};
</script>