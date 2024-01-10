<script setup lang="ts">
import Ticketlist from '@/components/Ticketlist.vue';
import {useDark} from "@vueuse/core";
import {computed, onMounted, ref, watch} from "vue";
import {useTicketStore} from "@/stores/tickets";
import {getNameFromId} from "@/helpers/getName";
import { useAccountStore } from '@/stores/accounts';
import AuthUserModel from '@/models/AuthUserModel';

const isDark = useDark()

const props = defineProps({
  user: {
    type: AuthUserModel,
    required: true
  }
})

const currentRole = computed(() => {
  return useAccountStore().currentUserRole ? getNameFromId(useAccountStore().userRoles, useAccountStore().currentUserRole!.role_id, 'role_id') : null
})

const tickets = ref<Record<string, any>[]>([])
onMounted(async () => {
  await useTicketStore().getTicketsOfOneCustomer(props.user?.id)

  tickets.value = useTicketStore().ticketsOfOneCustomer

  for (let ticket of tickets.value) {
    ticket.statusName = getNameFromId(useTicketStore().ticketStatus, ticket.status_id, 'status_id')
    ticket.typeName = getNameFromId(useTicketStore().ticketTypes, ticket.type_id, 'type_id')
  }
})
</script>

<template>
  <main :class="{dark: isDark}">
    <div class="header">Tickets</div>
    <Ticketlist :values="tickets"/>
  </main>
</template>

<style scoped lang="scss">
main {
  &.dark {
    .header {
      color: $text-dark;
    }
  }
}
.header {
  color: $text-light;
  margin-top: 3rem;
  text-align: center;
  font-size: calc($text-header * 1.3);
}
</style>