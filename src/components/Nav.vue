<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { useDark } from '@vueuse/core'
import ColorModeToggle from "@/components/Toggles/ColorModeToggle.vue";
import { supabase } from "@/supabase"
import {useRouter} from "vue-router";
import AuthUserModel from "@/models/AuthUserModel";


const props = defineProps({
  user: {
    type: AuthUserModel,
    required: false
  }
});

const emit = defineEmits(['logged-out'])

const isDark = useDark()

const router = useRouter()

const isExpanded = ref(false);

import { useToast } from 'primevue/usetoast';
import {useAccountStore} from "@/stores/accounts";
import {getNameFromId} from "@/helpers/getName";

const toast = useToast();

const signOut = async () => {
  try{
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Logout failed', life: 3000 });
    }

    emit('logged-out')
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Logout failed', life: 3000 });
  } finally {
    await router.push('/login')
    toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully logged out', life: 3000 });
  }
}
const currentRole = computed(() => {
  return useAccountStore().currentUserRole ? getNameFromId(useAccountStore().userRoles, useAccountStore().currentUserRole!.role_id, 'role_id') : null
})
onMounted(async () => {
  await useAccountStore().getCurrentUserRole()
})
</script>

<template>
  <aside v-if="currentRole !== null" class="sidebar" :class="{isExpanded: isExpanded, dark: isDark}">
    <div class="size-toggle">
      <v-icon name="hi-arrow-sm-right" scale="1.5" @click="isExpanded = !isExpanded"/>
    </div>
    <div class="color-mode-toggle">
      <ColorModeToggle />
    </div>
    <div v-if="props.user" class="user-data">
      <div v-if="currentRole !== 'customer'" class="text">
        <span>{{ props.user.email.substring(0,2) }}</span>
        <Transition>
          <span v-if="isExpanded" class="text">{{ props.user.email.split('@')[0].substring(2).split('_').join(' ') }}</span>
        </Transition>
      </div>
    </div>
    <nav>
      <ul class="main-nav">
        <li class="nav-item">
          <RouterLink v-if="currentRole !== 'customer'" to="/" class="link">
            <v-icon name="hi-chart-pie" label="Dashboard" title="Dashboard" scale="1.5"></v-icon>
            <Transition>
              <div v-if="isExpanded" class="text">Dashboard</div>
            </Transition>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/tickets" class="link">
            <v-icon name="hi-collection" label="Tickets" title="Tickets" scale="1.5"></v-icon>
            <Transition>
              <div v-if="isExpanded" class="text">Tickets</div>
            </Transition>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink v-if="currentRole === 'admin'" to="/admin" class="link">
            <v-icon name="hi-adjustments" label="Admin" title="Admin" scale="1.5"></v-icon>
            <Transition>
              <div v-if="isExpanded" class="text">Admin</div>
            </Transition>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="link">
      <RouterLink v-if="currentRole !== 'customer'" to="/settings" class="settings link" >
        <v-icon name="hi-cog" label="Settings" title="Settings" scale="1.5"></v-icon>
        <Transition>
          <div v-if="isExpanded" class="text">Settings</div>
        </Transition>
      </RouterLink>
    </div>
    <a @click="signOut" class="logout link">
      <v-icon name="hi-logout" label="Logout" title="Logout" scale="1.5"></v-icon>
      <Transition>
        <div v-if="isExpanded" class="text">Logout</div>
      </Transition>
    </a>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  height: calc(100dvh - 1rem);
  padding: 1rem 0.5rem;
  margin: 0.5rem;
  background: $bg-light;
  width: 45px;
  transition: all 0.4s ease-in-out;
  border-radius: $radius-standard;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  color: $text-light;
  position: relative;
  font-size: $text;

  &.isExpanded {
    width: 180px;
    transition: all 0.4s ease-in-out;
    border-top-right-radius: $radius-big;
    border-bottom-right-radius: $radius-big;

    .size-toggle {
      transform: rotate(-180deg);
    }

    .color-mode-toggle {
      margin-left: 0.75rem;
    }
  }

  .size-toggle {
    position: absolute;
    right: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: $bg-light;
    border-radius: 50px;
    transition: all 0.4s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
    }
  }

  .color-mode-toggle {
    margin-top: 1rem;
    margin-left: 1px;
    transition: all 0.4s ease-in-out;
  }

  .user-data {
    margin-top: -12rem;
    margin-left: 4px;
    height: 2rem;
  }

  .main-nav {
    margin: 0;
    padding: 0;

    .nav-item {
      list-style: none;
      margin: 0.5rem 0;
    }
  }

  .link {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      color: $hover-light;
      cursor: pointer;
    }
  }

  .logout {
    margin-bottom: 2rem;
  }

  &.dark {
    background: $bg-dark;
    color: $text-dark;

    .size-toggle {
      background: $bg-dark;
    }

    .link {
      &:hover {
        color: $hover-dark;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transform: translateX(0);
  transition: transform 0.8s ease, opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(-7rem);
}
</style>