<script setup lang="ts">
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';
import {useDark} from "@vueuse/core";

const isDark = useDark()

function save() {
  console.log("Hiii wurd gar nicht gesaved höhöhö")
}
</script>

<template>
  <main class="settings-container" :class="{dark: isDark}">
    <div class="header">Account settings</div>
    <div class="content">
      <div class="avatar-container">
        <img src="@/assets/avatars/Bambi.png" alt="user avatar" class="avatar"/>
        <Button class="picker" button-type="cancel" icon="pi pi-upload"/>
      </div>
      <div class="name">
        <Input type="text" label="First name"/>
        <Input type="text" label="Last name"/>
      </div>
    </div>
    <div class="footer">
      <Button @click="save()" button-type="submit" label="Save changes"></Button>
    </div>
  </main>
</template>

<style scoped lang="scss">
$avatar-size: 400px;

@media(max-width: 1300px) {
  .content {
    flex-direction: column;
  }
}

.settings-container {
  position: relative;

  &.dark {
    .header {
      color: $text-dark;
    }
  }

  .header {
    color: $text-light;
    margin-top: 3rem;
    text-align: center;
    font-size: calc($text-header * 1.3);
  }

  .content {
    display: flex;
    gap: 8rem;
    align-items: center;
    justify-content: center;
    height: 80%;

    .name {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .avatar-container {
      display: flex;
      flex-direction: column;
      text-align: center;
      position: relative;

      .avatar {
        max-width: $avatar-size;
        max-height: $avatar-size;
        border-radius: calc($avatar-size / 2);
      }

      .picker {
        position: absolute;
        bottom: -3rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>