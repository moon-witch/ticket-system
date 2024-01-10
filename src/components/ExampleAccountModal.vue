<script setup lang="ts">
import Dialog from "primevue/dialog";
import {ref, watch} from "vue";
import {useDark} from "@vueuse/core";

const isDark = useDark()
const props = defineProps( {
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const open = ref(false)

watch(props, () => {
  open.value = props.visible
})

watch(open, () => {
  if (open.value === false) {
    emit('close')
  }
})
</script>

<template>
  <div class="dialog-container">
    <Dialog v-model:visible="open" modal :dismissable-mask="true" position="top">
      <template #container>
        <div class="content-container" :class="{dark: isDark}">
          <div class="header">This is a proof of concept</div>
          <div class="info">If you want to create an account, feel free to click the link at the bottom of the page.</div>
          <div class="info">Otherwise you can use one of the following test accounts with corresponding rights and views:</div>
          <div class="accounts">
            <div class="mail">customer@test.com</div>
            <div class="mail">employee@test.com</div>
            <div class="mail">admin@test.com</div>
          </div>
          <div>They all use the password <span class="pw">'admin'</span></div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.content-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  color: $text-light;
  background: $page-bg-dark;

  &.dark {
    color: $text-dark;
  }

  .header {
    font-size: $text-header;
    margin-bottom: 1rem;
  }

  .info {
    margin: 1rem;
  }

  .accounts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .mail {
      font-weight: bold;
    }
  }
}
</style>