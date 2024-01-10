<script setup lang="ts">
import Ticketlist from '@/components/Ticketlist.vue';
import {useDark} from "@vueuse/core";
import {onMounted, ref} from "vue";
import {useTicketStore} from "@/stores/tickets";
import {getNameFromId} from "@/helpers/getName";
import {useAccountStore} from "@/stores/accounts";

const isDark = useDark()

const emit = defineEmits(['is-mounted'])

const tickets = ref<Record<string, any>[]>([])
onMounted(async () => {
  await useTicketStore().getAllTickets()

  tickets.value = useTicketStore().tickets

  for (let ticket of tickets.value) {
    ticket.customerName = getNameFromId(useAccountStore().customers, ticket.customer_id, 'user_id')
    ticket.employeeName = getNameFromId(useAccountStore().employees, ticket.assignee, 'user_id')
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