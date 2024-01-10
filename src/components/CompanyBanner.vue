<script setup lang="ts">
import {useDark} from "@vueuse/core";

const isDark = useDark()
</script>

<template>
  <div class="banner-container" :class="{dark: isDark}">
    <div class="text">TechAvant</div>
  </div>
</template>

<style scoped lang="scss">
.banner-container {
  color: $text-light;
  font-weight: bold;
  font-size: 100px;
  position: relative;

  &.dark {
    color: $text-dark;

    .text {
      background-image: linear-gradient(
              103deg,
              $text-sub-dark 0%,
              $text-sub-light 100%
      );
    }
  }

  .text {
    background-image: linear-gradient(
            103deg,
            $text-sub-light 0%,
            $text-sub-dark 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .wave {
    position: relative;
    height: 40px;
    width: 600px;
    background: transparent;
  }
  .wave:before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 340px;
    height: 27px;
    background-color: $text-sub-dark;
    right: -20px;
    top: -9px;
  }
  .wave:after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 300px;
    height: 30px;
    background-color: $text-sub-light;
    left: 0;
    top: -11px;
  }
}
</style>