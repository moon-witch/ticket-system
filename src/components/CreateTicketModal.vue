<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from '@/components/Button.vue'
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import {useDark} from "@vueuse/core";
import {onMounted, reactive, ref} from "vue";
import {useTicketStore} from "@/stores/tickets";
import {useAccountStore} from "@/stores/accounts";
import {computed} from "vue";
import {getNameFromId} from "@/helpers/getName";
import AuthUserModel from '@/models/AuthUserModel';

const isDark = useDark()

const props = defineProps( {
  visible: {
    type: Boolean,
    required: true
  },
  user: {
    type: AuthUserModel,
    required: true
  }
})

const emit = defineEmits(['closeModal', 'ticket-created'])

const newTicket: any = reactive({
  dueDate: null,
  lastMessage: null,
  type: null,
  department: null,
  employee: null,
  customer: null,
  status: 1,
  priority: null
})

const ticketTypes = ref<Record<string, any>[]>([])
const customers = ref<Record<string, any>[]>([])
const priorities = ref<Record<string, any>[]>([])
const employees = ref<Record<string, any>[]>([])
const departments = ref<Record<string, any>[]>([])

onMounted(async () => {
  await useTicketStore().getTicketTypes()
  await useTicketStore().getPriorities()
  await useAccountStore().getCustomers()
  await useAccountStore().getEmployees()
  await useTicketStore().getDepartments()
  await useTicketStore().getStatus()
  await useAccountStore().getAllUserRoles()

  ticketTypes.value = useTicketStore().ticketTypes
  customers.value = useAccountStore().customers
  priorities.value = useTicketStore().priorities
  employees.value = useAccountStore().employees
  departments.value = useTicketStore().departments

  if (currentRole.value === 'customer') {
    newTicket.customer = { user_id: props.user!.id }
    newTicket.priority = { priority_id: 2 }
    newTicket.department = { department_id: 1 }
    newTicket.employee = { user_id: null }
  }
})

const closeModal = () => {
  newTicket.dueDate = null
  newTicket.type = ''
  newTicket.department = ''
  newTicket.employee = ''
  newTicket.customer = ''
  newTicket.priority = ''

  emit('closeModal')
}

const createTicket = async (newTicket: Record<string, any>) => {
  await useTicketStore().createTicket(newTicket)
  await useTicketStore().getTicketsOfOneCustomer(props.user?.id)

  emit('ticket-created')
  closeModal()
}

const currentRole = computed(() => {
  return useAccountStore().currentUserRole ? getNameFromId(useAccountStore().userRoles, useAccountStore().currentUserRole!.role_id, 'role_id') : null
})
</script>

<template>
  <div class="dialog-container">
    <Dialog v-model:visible="props.visible" modal>
      <template #container="{ closeCallback }">
        <div v-if="currentRole !== null" class="content-container" :class="{dark: isDark}">
          <div class="header">New ticket</div>
          <div class="inputs">
            <label class="label" for="type">Type</label>
            <Dropdown id="type" v-model="newTicket.type" editable :options="ticketTypes" optionLabel="name" :class="{empty: newTicket.type === ''}"/>
            <label v-if="currentRole !== 'customer'" class="label" for="customer">Customer</label>
            <Dropdown v-if="currentRole !== 'customer'"  id="customer" v-model="newTicket.customer" editable :options="customers" optionLabel="name" :class="{empty: newTicket.customer === ''}" />
            <label v-if="currentRole !== 'customer'" class="label" for="priority">Priority</label>
            <Dropdown v-if="currentRole !== 'customer'" id="priority" v-model="newTicket.priority" editable :options="priorities" optionLabel="name" :class="{empty: newTicket.priority === ''}" />
            <label v-if="currentRole !== 'customer'" class="label" for="assignee">Assignee</label>
            <Dropdown v-if="currentRole !== 'customer'" id="assignee" v-model="newTicket.employee" editable :options="employees" optionLabel="name" :class="{empty: newTicket.employee === ''}" />
            <label v-if="currentRole !== 'customer'" class="label" for="department">Department</label>
            <Dropdown v-if="currentRole !== 'customer'" id="department" v-model="newTicket.department" editable :options="departments" optionLabel="name" :class="{empty: newTicket.department === ''}" />
            <label v-if="currentRole !== 'customer'" class="label" for="dueDate">Due date</label>
            <Calendar v-if="currentRole !== 'customer'" v-model="newTicket.dueDate" showIcon iconDisplay="input" :class="{empty: newTicket.dueDate === ''}"/>
          </div>
          <div class="buttons">
            <Button button-type="submit" label="create" @click="createTicket(newTicket)"/>
            <Button button-type="cancel" label="cancel" @click="closeModal"/>
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

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .label {
      font-size: $text-subheader;
      margin-bottom: -10px;
    }

    .empty {
      border: 1px solid red;
    }
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