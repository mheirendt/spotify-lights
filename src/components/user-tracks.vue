<template>
  <div class="user-tracks">
    <v-sheet
      v-for="(item, idx) of tracks"
      :key="item.added"
      dark
      :color="idx % 2 === 0 ? 'accent' : 'secondary'"
      @click="$emit('select', item)"
      class="track d-flex justify-start"
    >
      <v-img
        :src="item.track.album.images[2].url"
        contain
        :max-height="60"
        :max-width="60"
      ></v-img>
      <div class="flex-vertical align-self-center ml-2">
        <div>{{ item.track.name }}</div>
        <div>{{ item.track.artists.map((a) => a.name).join(", ") }}</div>
      </div>
    </v-sheet>
    <div class="d-flex loading" v-if="tracks.length < count">
      <div class="mx-auto pt-2">
        <v-icon class="icon" v-intersect="loadMore" :size="38"
          >mdi-loading</v-icon
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.user-tracks {
  .track {
    cursor: pointer;
  }
  .flex-vertical {
    display: flex;
    flex-direction: column;
  }
  .loading {
    overflow: overlay;
    height: 50px;
    .icon {
      animation: rotation 1s infinite linear;
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
}
</style>
<script>
import { debounce } from "lodash";

export default {
  props: {
    loading: Boolean,
    tracks: Array,
    count: Number,
  },
  data: () => ({
    page: 1,
  }),
  methods: {
    loadMore: debounce(function (entries, observer, isIntersecting) {
      if (!isIntersecting) return;
      this.$emit("page", ++this.page);
    }, 500),
  },
};
</script>