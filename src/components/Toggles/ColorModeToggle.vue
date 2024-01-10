<script setup lang="ts">
import {useDark} from "@vueuse/core";
import {useToggle} from "@vueuse/core";

const isDark = useDark()

const toggleDark = useToggle(isDark)
</script>

<template>
    <div class="button r" id="button-3" :class="{dark: isDark}">
      <input type="checkbox" class="checkbox" @click="toggleDark()"/>
      <div class="knobs"></div>
      <div class="layer"></div>
    </div>
</template>

<style scoped lang="scss">
* {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

*:focus {
  outline: none;
}

.knobs,
.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.button {
  position: relative;
  width: 26px;
  height: 13px;
  margin: -20px auto 0 auto;
  overflow: hidden;
}

.button.r,
.button.r .layer {
  border-radius: 100px;
}

.button.b2 {
  border-radius: 2px;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
  bottom: 4px;
}

.knobs {
  z-index: 2;
}

.layer {
  width: 100%;
  background: $bg-dark;
  transition: 0.3s ease all;
  z-index: 1;
}

#button-3 .knobs:before {
  content: "";
  position: absolute;
  top: 1px;
  left: 4px;
  width: 6px;
  height: 5px;
  padding: 3px 2px;
  background-color: $bg-light;
  border-radius: 50%;
  transition: 0.3s ease all, left 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15);
}

#button-3 .checkbox:active + .knobs:before {
  width: 15px;
  border-radius: 100px;
}

#button-3 .checkbox:checked:active + .knobs:before {
  margin-left: -8px;
}

#button-3 {
  &.dark {
    .checkbox:checked + .knobs:before {
      background-color: $bg-dark;
    }

    .checkbox:checked ~ .layer {
      background-color: $bg-light;
    }

    .knobs:before {
      background: $bg-dark;
    }

    .layer {
      background: $bg-light;
    }
  }

  .checkbox:checked + .knobs:before {
    content: "";
    left: 11px;
    background-color: $bg-light;
  }

  .checkbox:checked ~ .layer {
    background-color: $bg-dark;
  }
}
</style>