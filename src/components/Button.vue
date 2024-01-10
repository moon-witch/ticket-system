<script setup lang="ts">
import {useDark} from "@vueuse/core";

const props = defineProps({
  loading: {
    type: Boolean
  },
  label: {
    type: String,
    default: null
  },
  buttonType: {
    type: String,
    options: ['submit', 'cancel']
  },
  icon: {
    type: String,
    default: null
  }
})

const isDark = useDark()
</script>

<template>
  <div class="button-wrap" :class="{dark: isDark}">
    <button v-if="props.buttonType === 'submit'" type="submit" class="button submit-button">
      <v-icon v-if="props.loading" name="ri-loader-5-fill" class="spinner"/>
      <i v-if="props.icon && !props.loading" class="pi" :class="props.icon" />
      <span v-if="props.label && !props.loading" class="text">
        {{ props.label }}
      </span>
    </button>
    <button v-if="props.buttonType === 'cancel'" type="button" class="button cancel-button">
      <v-icon v-if="props.loading" name="ri-loader-5-fill" class="spinner"/>
      <i v-if="props.icon && !props.loading" class="pi" :class="props.icon" />
      <span v-if="props.label && !props.loading" class="text">
        {{ props.label }}
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.button-wrap {
  width: fit-content;
  .button {
    background: transparent;
    border: none;
    color: $text-light;
    font-size: $text;
    border-radius: $radius-small;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
      color: $text-dark;
      background: $hover-light;

      .text {
        color: $text-light;
      }
    }

    .text {
      font-size: $text-subheader;
      font-weight: bold;
      font-family: "quicksandregular", sans-serif;
      margin: 0 0.5rem;
    }
  }

  .submit-button {
    background: $text-sub-light;
    color: $text-dark;

    &:hover {
      background: $bg-light;
      color: $text-light;
    }
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  &.dark {
    .button {
      color: $text-dark;

      &:hover {
        color: $text-light;
        background: $secondary;

        .text {
          color: inherit;
        }
      }

      .text {
        color: $text-dark;
      }
    }

    .submit-button {
      background: $text-sub-dark;
      color: $primary;

      .text {
        color: $text-light;
      }
    }
  }
}
</style>