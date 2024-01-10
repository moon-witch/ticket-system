<script setup lang="ts">
import {useDark} from "@vueuse/core";

const isDark = useDark()

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  department: {
    required: true
  },
  created: {
    type: String,
    required: true
  },
  msgType: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="message-container"
       :class="{dark: isDark, internal: msgType === 'internal', external: msgType === 'external', keynote: msgType === 'keynote'}">
    <div v-if="department != null" class="type">
      {{ props.msgType }}
    </div>
    <div class="header">
      <div class="sender">
        {{ props.sender }}
        <div v-if="department != null" class="dep">
          {{ props.department }}
        </div>
      </div>
      <div class="created">
        {{ new Date($props.created).toLocaleString() }}
      </div>
    </div>
    <div class="msg">
      {{ props.message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-container {
  border: 1px solid $bg-dark;
  border-radius: $radius-small;
  padding: 0.5rem;
  margin: 1rem 0;
  position: relative;

  .type {
    font-size: $text-subheader;
    position:absolute;
    top: -11px;
    right: 10px;
    background: $page-bg-light;
    padding: 0 0.5rem;
    border-radius: $radius-small;
  }

  .header {
    display: flex;
    justify-content: space-between;
    font-size: $text-subheader;
    gap: 2rem;
    padding: 0.5rem 0;

    .sender {
      font-weight: bold;
      display: flex;
      gap: 0.5rem;

      .dep {
        font-weight: normal;
      }
    }
  }
  &.internal {
    width: fit-content;
    border-color: darkred;
    background: rgba(139, 0, 0, 0.1);

    .type {
      border: 1px solid darkred;
    }
  }
  &.external {
    width: fit-content;
    border-color: darkblue;
    background: rgba(0, 0, 139, 0.1);

    .type {
      border: 1px solid darkblue;
    }
  }
  &.keynote {
    width: fit-content;
    border-color: darkorange;
    background: rgba(255, 140, 0, 0.1);

    .type {
      border: 1px solid darkorange;
    }
  }

  &.dark {
    .type {
      background: $page-bg-dark;
    }
  }
}
</style>