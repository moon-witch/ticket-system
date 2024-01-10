<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { FilterMatchMode } from 'primevue/api';
import {ref} from "vue";
import {useDark} from "@vueuse/core";

const props = defineProps({
  values: {
    type: Array,
    required: true
  }
})

const globalFilterFields = ['ticket_id', 'customerName', 'employeeName']
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ticket_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  typeName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  statusName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  employeeName: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const types = ['Bug', 'Request', 'Support']
const status = ['New', 'Forwarded', 'In Progress', 'Closed']

const isDark = useDark()

const loading = ref(false)

const selectedTicket = ref()

import {useRouter} from "vue-router";
import {computed} from "vue";
import {useAccountStore} from "@/stores/accounts";
import {getNameFromId} from "@/helpers/getName";

const router = useRouter()

const currentRole = computed(() => {
  return useAccountStore().currentUserRole ? getNameFromId(useAccountStore().userRoles, useAccountStore().currentUserRole!.role_id, 'role_id') : null
})

const rowClicked = (event: any) => {
  if (currentRole.value === 'customer') {
    router.push(`/customer/tickets/${event.data.ticket_id}`)
  } else {
    router.push(`/tickets/${event.data.ticket_id}`)
  }
}

</script>

<template>
  <div v-if="currentRole !== null" class="table-container" :class="{dark: isDark}">
    <DataTable
        :loading="loading"
        :value="props.values"
        sortField="ticket_id"
        :sortOrder="1"
        :scrollable="true"
        scroll-height="65vh"
        :global-filter-fields="globalFilterFields"
        filterDisplay="menu"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        removableSort
        v-model:selection="selectedTicket"
        v-model:filters="filters"
        @row-click="rowClicked($event)"
        selectionMode="single"
        dataKey="id"
    >
      <template #header>
        <div v-if="props.values.length > 10" class="global-filter">
            <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" style="width: 26rem;"/>
            </span>
        </div>
      </template>
      <template #empty> No tickets found </template>
      <Column v-if="currentRole === 'customer'" :sortable="false" field="seen_by_customer" header="" style="width: 0; height: 0; padding: 0;" :class="'no-border'" :show-filter-menu="false" :show-filter-match-modes="false" :showApplyButton="false" :show-clear-button="false">
        <template #body="{ data }">
          <div v-if="!data.seen_by_customer" style="transform: rotate(-5deg)">
            <v-icon name="md-fibernew-outlined" label="Dashboard" title="Dashboard" scale="2"></v-icon>
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by id" />
        </template>
      </Column>
      <Column :sortable="true" field="ticket_id" header="Id" :show-filter-match-modes="false" :showApplyButton="false" :show-clear-button="false">
        <template #body="{ data }">
          {{ data.ticket_id }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by id" />
        </template>
      </Column>
      <Column v-if="currentRole !== 'customer'" :sortable="true" field="customerName" header="Customer" :show-filter-match-modes="false" :showApplyButton="false" :show-clear-button="false">
        <template #body="{ data }">
          {{ data.customerName }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by customer" />
        </template>
      </Column>
      <Column :sortable="true" field="typeName" header="Type" :show-filter-match-modes="false" :showApplyButton="false" :show-clear-button="false">
        <template #body="{ data }">
          {{ data.typeName }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Any" class="p-column-filter" :maxSelectedLabels="1">
            <template #option="slotProps">
              <div>
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column :sortable="true" field="statusName" header="Status" :show-filter-match-modes="false" :showApplyButton="false" :show-clear-button="false">
        <template #body="{ data }">
          {{ data.statusName }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="status" placeholder="Any" class="p-column-filter" :maxSelectedLabels="1">
            <template #option="slotProps">
              <div>
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column v-if="currentRole !== 'customer'" :sortable="true" field="employeeName" header="Assignee" :show-filter-match-modes="false" :showApplyButton="false" :show-clear-button="false">
        <template #body="{ data }">
          {{ data.employeeName }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
.table-container {
  padding: 3rem;
  text-align: center;

  .global-filter {
    display: flex;
    justify-content: center;

    .p-input-icon-left i{
      color: $text-light;
    }
  }

  ::v-deep(.p-datatable-header) {
    background: transparent;
    border: none;
  }

  ::v-deep(.p-column-header-content) {
    color: $text-light;
    border: 1px solid $bg-light;
    border-radius: $radius-big;
    padding: 0.5rem 1rem;
    justify-content: center;
    font-family: "quicksandregular", sans-serif;
    font-weight: bold;
    font-size: $text;
  }

  ::v-deep(.p-datatable.p-datatable-scrollable > .p-datatable-wrapper > .p-datatable-table > .p-datatable-thead, .p-datatable.p-datatable-scrollable > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tfoot, .p-datatable.p-datatable-scrollable > .p-datatable-wrapper > .p-virtualscroller > .p-datatable-table > .p-datatable-thead, .p-datatable.p-datatable-scrollable > .p-datatable-wrapper > .p-virtualscroller > .p-datatable-table > .p-datatable-tfoot) {
    background: transparent;
    border: none;
  }

  ::v-deep(.p-datatable .p-datatable-thead > tr > th) {
    background: $page-bg-light;
    border: none;
  }

  ::v-deep(.p-datatable .p-sortable-column .p-sortable-column-icon) {
    color: $text-light;
  }

  ::v-deep(.p-datatable .p-datatable-tbody > tr) {
    color: $text-light;
    background: transparent;
    border-radius: $radius-big;
    font-family: "quicksandregular", sans-serif;
    font-weight: bold;
    font-size: $text;
    transition: all 0.1s ease-in-out;

    &:hover {
      background: $bg-light;
      cursor: pointer;
    }

    td:first-child {
      border-left-style: solid;
      border-top-left-radius: $radius-standard;
      border-bottom-left-radius: $radius-standard;
      border-color: $page-bg-light;
    }

    td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: $radius-standard;
      border-top-right-radius: $radius-standard;
      border-color: $page-bg-light;
    }
  }

  ::v-deep(.p-datatable .p-datatable-tbody > tr > td ) {
    border: none;
    text-align: center;
  }

  ::v-deep(.p-paginator) {
    background: transparent;
    border: none;
    margin-top: 1rem;
  }

  ::v-deep(.p-paginator .p-paginator-first) {
    color: $text-light;
  }

  ::v-deep(.p-paginator .p-paginator-prev) {
    color: $text-light;
  }

  ::v-deep(.p-paginator .p-paginator-next) {
    color: $text-light;
  }

  ::v-deep(.p-paginator .p-paginator-last) {
    color: $text-light;
  }

  ::v-deep(.p-paginator .p-paginator-pages .p-paginator-page) {
    color: $text-light;
  }

  ::v-deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
    color: $text-light;
    background: $bg-light;
  }

  ::v-deep(.p-dropdown) {
    background: $bg-light;
    border: none;
  }

  ::v-deep(.p-focus) {
    outline: none;
    box-shadow: none;
  }

  ::v-deep(.p-column-filter-menu-button) {
    color: $text-light;
  }

  &.dark {
    .global-filter {
      .p-input-icon-left i{
        color: $text-dark;
      }
    }

    ::v-deep(.p-inputtext) {
      color: $text-dark;
      background: $bg-dark;
    }

    ::v-deep(.p-multiselect) {
      background: $bg-dark;
    }
    ::v-deep(.no-border) {
      .p-column-header-content {
        border: none;
      }
    }
    ::v-deep(.p-column-header-content) {
      color: $text-dark;
      border: 1px solid $bg-dark;
    }
    ::v-deep(.p-datatable .p-sortable-column .p-sortable-column-icon) {
      color: $text-dark;
    }
    ::v-deep(.p-datatable .p-datatable-thead > tr > th) {
      background: $page-bg-dark;
    }
    ::v-deep(.p-datatable .p-datatable-tbody > tr) {
      color: $text-dark;

      td:first-child {
        border-color: $page-bg-dark;
      }

      td:last-child {

        border-color: $page-bg-dark;
      }
      &:hover {
        background: $bg-dark;
      }
    }
    ::v-deep(.p-paginator .p-paginator-first) {
      color: $text-dark;
    }
    ::v-deep(.p-paginator .p-paginator-prev) {
      color: $text-dark;
    }
    ::v-deep(.p-paginator .p-paginator-next) {
      color: $text-dark;
    }
    ::v-deep(.p-paginator .p-paginator-last) {
      color: $text-dark;
    }
    ::v-deep(.p-paginator .p-paginator-pages .p-paginator-page) {
      color: $text-dark;
    }
    ::v-deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
      color: $text-dark;
      background: $bg-dark;
    }
    ::v-deep(.p-dropdown) {
      background: $bg-dark;
    }

    ::v-deep(.p-column-filter-menu-button) {
      color: $text-dark;
    }
  }
}
</style>