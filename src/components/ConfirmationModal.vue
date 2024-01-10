<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from '@/components/Button.vue'
import {useDark} from "@vueuse/core";

const isDark = useDark()

const props = defineProps( {
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    required: false,
    default: 'Yes'
  },
  denyText: {
    type: String,
    required: false,
    default: 'No'
  }
})

const emit = defineEmits(['closeModal', 'confirmed', 'denied'])

const closeModal = () => {
  emit('closeModal')
}

const confirm = () => {
  emit('confirmed')
  closeModal()
}

const deny = () => {
  emit('denied')
  closeModal()
}

</script>

<template>
  <div class="dialog-container">
    <Dialog v-model:visible="props.visible" modal>
      <template #container="{ closeCallback }">
        <div class="content-container" :class="{dark: isDark}">
          <div class="header">{{ props.title }}</div>
          <div class="question">
            {{ props.question }}
          </div>
          <div class="buttons">
            <Button button-type="submit" :label="confirmText" @click="confirm"/>
            <Button button-type="cancel" :label="denyText" @click="deny"/>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.content-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: $radius-small;
  background: $page-bg-light;
  color: $text-light;

  .header {
    text-align: center;
    font-size: $text;
    color: inherit;
    margin-bottom: 0.5rem;
  }

  .question {
    word-wrap: break-word;
    text-align: center;
    gap: 1rem;
  }
  .buttons {
    display: flex;
    justify-content: space-evenly;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  &.dark {
    background: $page-bg-dark;
    color: $text-dark;
  }
}
</style>