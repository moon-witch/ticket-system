<script setup lang="ts">
import AccountList from "@/components/AccountList.vue";
import EditAccountModal from "@/components/EditAccountModal.vue";
import {ref, type Ref} from "vue";
import {useDark} from "@vueuse/core";
import AccountModel from "@/models/AccountModel";

const isDark = useDark()
const modalOpen = ref(false)
const userToEdit: Ref<AccountModel | undefined> = ref(undefined)
const key = ref(0)

const openModalTrigger = (event: any) => {
  let acc = new AccountModel()
  Object.assign(acc, event.data)
  userToEdit.value = acc
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  userToEdit.value = undefined
}

const reloadList = () => {
  key.value++
}
</script>

<template>
  <div class="admin-container" :class="{dark: isDark}">
    <div class="header">Admin Panel</div>
    <AccountList @open-edit-modal="openModalTrigger($event)" :key="key"/>
    <EditAccountModal :user="userToEdit" :visible="modalOpen" @close-modal="closeModal" @user-updated="reloadList"/>
  </div>
</template>

<style scoped lang="scss">
.admin-container {
  width: 100%;
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
}
</style>