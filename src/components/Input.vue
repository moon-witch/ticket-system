<script setup lang="ts">
import {useDark} from "@vueuse/core";
import {ref} from "vue";

const props = defineProps({
  type: {
    type: String,
    options: ['text', 'email', 'password'],
    required: true
  },
  label: {
    type: String,
    default: '',
  }
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const emit = defineEmits(['value-changed-text', 'value-changed-email', 'value-changed-password', `value-changed-${string}`]);

const isDark = useDark()

const newValue = ref('')

const emitNewValue = (type: string) => {
  emit(`value-changed-${type}`, newValue.value)
}
</script>

<template>
  <div class="input-wrap" :class="{dark: isDark}">
    <input @input="emitNewValue('text')" v-model="newValue" v-if="props.type === 'text'" type="text" class="input">
    <input @input="emitNewValue('email')" v-model="newValue" v-if="props.type === 'email'" type="email" class="input">
    <input @input="emitNewValue('password')" v-model="newValue" v-if="props.type === 'password'" type="password" class="input">
    <label class="label">{{ props.label }}</label>
  </div>
</template>

<style scoped lang="scss">
*:focus {
  outline: none;
}

.input-wrap {
  position: relative;

  &.dark {
    .input {
      background: $text-sub-dark;
      color: $text-light;

      &:focus {
        background: $bg-light;
      }
    }

    .label {
      color: $text-dark;
    }
  }

  .input {
    background: $text-sub-light;
    color: $text-dark;
    padding: 0.5rem 1rem;
    border-radius: $radius-small;
    border: 1px solid transparent;
    font-size: $text;
    transition: all 0.2s ease-in-out;

    &:focus {
      background: $bg-light;
      color: $text-light;
      border: 1px solid $bg-dark;
    }
  }

  .label {
    color: $text-light;
    position: absolute;
    left: 50%;
    top: -22px;
    transform: translateX(-50%);
    font-weight: bold;
  }
}
</style>