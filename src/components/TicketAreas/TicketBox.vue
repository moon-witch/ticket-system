<script setup lang="ts">
import {useDark} from "@vueuse/core";
import {onMounted, ref, watch} from "vue";
import {useTicketStore} from "@/stores/tickets";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import {useAccountStore} from "@/stores/accounts";
import {getNameFromId} from "@/helpers/getName";
import {useToast} from "primevue/usetoast";

const isDark = useDark()
const toast = useToast()

const props = defineProps({
  ticketData: {
    type: Object,
    required: true
  }
})

const ticketTypes = ref<Record<string, any>[]>([])
const customers = ref<Record<string, any>[]>([])
const priorities = ref<Record<string, any>[]>([])
const employees = ref<Record<string, any>[]>([])
const departments = ref<Record<string, any>[]>([])
const ticketStatus = ref<Record<string, any>[]>([])

const typeValue = ref()
const customerValue = ref()
const priorityValue = ref()
const statusValue = ref()
const assigneeValue = ref()
const departmentValue = ref()
const dueDateValue = ref()

onMounted(async () => {
  ticketTypes.value = useTicketStore().ticketTypes
  customers.value = useAccountStore().customers
  priorities.value = useTicketStore().priorities
  employees.value = useAccountStore().employees
  departments.value = useTicketStore().departments
  ticketStatus.value = useTicketStore().ticketStatus
})

watch(props, () => {
  typeValue.value = getNameFromId(useTicketStore().ticketTypes, props.ticketData.type_id, 'type_id')
  customerValue.value = getNameFromId(useAccountStore().customers, props.ticketData.customer_id, 'user_id')
  priorityValue.value = getNameFromId(useTicketStore().priorities, props.ticketData.priority_id, 'priority_id')
  statusValue.value = getNameFromId(useTicketStore().ticketStatus, props.ticketData.status_id, 'status_id')
  assigneeValue.value = getNameFromId(useAccountStore().employees, props.ticketData.assignee, 'user_id')
  departmentValue.value = getNameFromId(useTicketStore().departments, props.ticketData.department_id, 'department_id')
  dueDateValue.value = props.ticketData.due_date == null ? null : new Date(props.ticketData.due_date)
})

const loadingState = useTicketStore().loadingState
const updateDbEntry = (updateData: Record<string, any>, columnName: string, updateKey: string, updateTicketId: string = props.ticketData.ticket_id) => {
  useTicketStore().updateTicketData(updateData, columnName, updateKey, updateTicketId)
  toast.add({ severity: 'info', summary: '', detail: `${updateKey} changed to ${updateData.name ?? updateData.toDateString()}`, life: 3000 });
}
</script>

<template>
  <div class="ticket-container" :class="{dark: isDark}">
    <div class="header">Ticketinfo</div>
    <div class="created">
      Ticket created:
      <span class="date">{{ ticketData ? new Date(ticketData.creation_date).toLocaleString() : 'unknown'}}</span>
    </div>
    <div class="inputs">
      <div class="input-box">
        <label class="label" for="type">Type</label>
        <div class="input">
          <Dropdown class="picker" id="type" v-model="typeValue" @change="updateDbEntry(typeValue, 'type_id', 'type_id')" editable :options="ticketTypes" optionLabel="name" :disabled="loadingState.type_id"/>
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.type_id}"/>
        </div>
      </div>
      <div class="input-box">
        <label class="label" for="customer">Customer</label>
        <div class="input">
          <Dropdown class="picker" id="customer" v-model="customerValue" @change="updateDbEntry(customerValue, 'customer_id', 'user_id')" editable :options="customers" optionLabel="name" :disabled="loadingState.customer_id"/>
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.customer_id}"/>
        </div>
      </div>
      <div class="input-box">
        <label class="label" for="priority">Priority</label>
        <div class="input">
          <Dropdown class="picker" id="priority" v-model="priorityValue" @change="updateDbEntry(priorityValue, 'priority_id', 'priority_id')" editable :options="priorities" optionLabel="name" :disabled="loadingState.priority_id" />
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.priority_id}"/>
        </div>
      </div>
      <div class="input-box">
        <label class="label" for="status">Status</label>
        <div class="input">
          <Dropdown class="picker" id="status" v-model="statusValue" @change="updateDbEntry(statusValue, 'status_id', 'status_id')" editable :options="ticketStatus" optionLabel="name" :disabled="loadingState.status_id" />
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.status_id}"/>
        </div>
      </div>
      <div class="input-box">
        <label class="label" for="assignee">Assignee</label>
        <div class="input">
          <Dropdown class="picker" id="assignee" v-model="assigneeValue" @change="updateDbEntry(assigneeValue, 'assignee', 'user_id')" editable :options="employees" optionLabel="name" :disabled="loadingState.assignee"/>
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.assignee}"/>
        </div>
      </div>
      <div class="input-box">
        <label class="label" for="department">Department</label>
        <div class="input">
          <Dropdown class="picker" id="department" v-model="departmentValue" @change="updateDbEntry(departmentValue, 'department_id', 'department_id')" editable :options="departments" optionLabel="name" :disabled="loadingState.department_id"/>
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.department_id}"/>
        </div>
      </div>
      <div class="input-box">
        <label class="label" for="dueDate">Due date</label>
        <div class="input">
          <Calendar class="picker" v-model="dueDateValue" @date-select="updateDbEntry(dueDateValue, 'due_date', '')" showIcon iconDisplay="input" :disabled="loadingState.due_date"/>
          <v-icon name="ri-loader-5-fill" class="spinner" :class="{loading: loadingState.due_date}"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ticket-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &.dark {
    .spinner {
      &.loading {
        color: $text-dark;
      }
    }
  }

  .header {
    font-size: $text;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .created {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .label {
    width: 6.5rem;
    margin-right: 1rem;
    text-align: center;
  }

  .input-box {
    display: flex;
    align-items: center;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .input {
    display: flex;
    align-items: center;
    width: 12rem;

    .picker {
      height: 2rem;
    }
  }

  .spinner {
    margin-left: 0.5rem;
    animation: spin 1s linear infinite;
    color: transparent;

    &.loading {
      color: $text-light;
    }
  }
}
</style>