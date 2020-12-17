<template>
  <div class="infinite-scroll">
    <slot />
    <v-sheet class="d-flex loading" v-if="items.length < total" color="white">
      <div class="mx-auto pt-2">
        <v-icon class="icon" color="primary" v-intersect="loadMore">{{
          loadingIcon
        }}</v-icon>
      </div>
    </v-sheet>
  </div>
</template>

<style lang="scss">
.infinite-scroll {
  .loading {
    overflow: overlay;
    height: 50px;
    .icon {
      font-size: 32px;
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
    items: Array,
    total: Number,
    loadingIcon: {
      type: String,
      default: () => "mdi-loading",
    },
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