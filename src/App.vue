<script setup lang="ts">
import { RouterView } from 'vue-router'
import Nav from '@/components/Nav.vue'
import {useDark} from "@vueuse/core";
import {supabase} from "@/supabase"
import {onMounted, onUpdated, ref, type Ref} from "vue";
import Toast from 'primevue/toast';
import SpeedDial from 'primevue/speeddial';
import AuthUserModel from './models/AuthUserModel';
import {useToast} from "primevue/usetoast";
import CreateTicketModal from "@/components/CreateTicketModal.vue"
import { useAccountStore } from './stores/accounts';
import ConfirmationModal from './components/ConfirmationModal.vue';
import { useConfirmation } from './stores/confirmation';

const isDark = useDark()
const toast = useToast()

const currentUser: Ref<AuthUserModel | undefined> = ref()

const key = ref(0)

const visible = ref(false)

const confirm = useConfirmation();

const items = ref([
  {
    label: 'New ticket',
    icon: 'pi pi-pencil',
    command: () => {
      toast.add({ severity: 'info', summary: '', detail: 'Create new ticket', life: 1000 });
      visible.value = true
    }
  },
  {
    label: 'Update',
    icon: 'pi pi-refresh',
    command: () => {
      toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated', life: 1000 });
    }
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      toast.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted', life: 1000 });
    }
  }
])

const getUser = async () => {
    const { data, error } = await supabase.auth.getSession()
    if(data.session?.user){
      currentUser.value = new AuthUserModel(String(data.session.user.email), String(data.session.user.id))
      useAccountStore().currentUserId = data.session.user.id
      await useAccountStore().setCurrentUser(data.session.user.id)
    }
    else {
      currentUser.value = undefined;
    }
}

onMounted(async () =>{
  await getUser()
})

onUpdated(async () => {
  if (!currentUser.value) {
    await getUser()
  }
})

const logout = () => {
  currentUser.value = undefined
  localStorage.removeItem('loggedIn')
}

// TODO:
// - create admin tab
// - create customers, admin, employees
// - add db to messages
</script>

<template>
    <div class="app-container" :class="{dark: isDark}">
      <Nav v-if="$route.path != '/login' && $route.path != '/register' && currentUser" :user="currentUser" :key="key" @logged-out="logout()"/>
      <RouterView v-slot="{ Component }" :user="currentUser" :key="key">
        <Transition>
          <component :is="Component"/>
        </Transition>
      </RouterView>
      <SpeedDial v-if="$route.path != '/login' && $route.path != '/register' && currentUser" :model="items" :radius="70" type="quarter-circle" direction="down-left" :style="{ right: '15px', top: '15px' }" />
      <CreateTicketModal v-if="$route.path != '/login' && $route.path != '/register' && currentUser" :visible="visible" @close-modal="visible = false" :user="currentUser" @ticket-created="key++"/>
      <Toast>
        <template #message="slotProps">
          <div v-if="isDark" style="flex: 1;">
            <div style="color: #ffaf96; margin: 0.25rem 0;">{{ slotProps.message.summary }}</div>
            <div style="color: #ffaf96; margin: 0.25rem 0;">{{ slotProps.message.detail }}</div>
          </div>
          <div v-else style="flex: 1;">
            <div style="color: #541707; margin: 0.25rem 0;">{{ slotProps.message.summary }}</div>
            <div style="color: #541707; margin: 0.25rem 0;">{{ slotProps.message.detail }}</div>
          </div>
        </template>
      </Toast>
      <ConfirmationModal :visible="confirm.visible" :title="confirm.title" :question="confirm.question"
        confirm-text:="confirm." @confirmed="confirm.userConfirmed" 
        :deny-text="confirm.denyText" @denied="confirm.userDenied"/>
    </div>
</template>

<style scoped lang="scss">
.app-container {
  height: 100dvh;
  display: flex;
  overflow: hidden;
  background: $page-bg-light;

  .toast-container {
    color: $text-light;
    background: black;

    .toast-summary {
      color: $text-light !important;
    }
  }

  &.dark {
    background: $page-bg-dark;
  }
}

.v-enter-active {
  transition: opacity 0.4s ease;
}
.v-leave-active {
  transition: none;
}

.v-leave-from {
  display: none;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>