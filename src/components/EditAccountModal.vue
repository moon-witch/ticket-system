<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from '@/components/Button.vue'
import Dropdown from 'primevue/dropdown';
import InputText from "primevue/inputtext";
import {useDark} from "@vueuse/core";
import {onMounted, reactive, ref, watch} from "vue";
import {useAccountStore} from "@/stores/accounts";
import {useToast} from "primevue/usetoast";
import AccountModel from '@/models/AccountModel';
import { useConfirmation } from '@/stores/confirmation';

const isDark = useDark()
const toast= useToast()

const props = defineProps( {
  visible: {
    type: Boolean,
    required: true
  },
  user: {
    type: AccountModel,
    required: false,
    default: null
  }
})

const emit = defineEmits(['closeModal', 'user-updated'])

const editUser = reactive(AccountModel.create_empty())

const departments = ref<Record<string, any>[]>([])
const roles = ref<Record<string, any>[]>([])

onMounted(async () => {
  departments.value = useAccountStore().departments
  roles.value = useAccountStore().userRoles
})

watch(props, () => {
  editUser.update(props.user)
})

const closeModal = () => {
  editUser.clearValue();

  emit('closeModal')
}

const updateUser = async () => {
  editUser.department_id = editUser.department!.department_id;
  editUser.role_id = editUser.role!.role_id;
  await useAccountStore().updateUser(editUser)
  await useAccountStore().getAllAccounts()

  toast.add({ severity: 'success', summary: '', detail: `${editUser.name} ${editUser.surname} updated`, life: 3000 });
  emit('user-updated')
  closeModal()
}

const deleteUser = async () => {
  useConfirmation().confirm = async () => {
    await useAccountStore().deleteUser(editUser.user_id);
    toast.add({ severity: 'success', summary: '', detail: `${editUser.name} ${editUser.surname} deleted`, life: 3000 });
    closeModal();
    await useAccountStore().getAllAccounts();
  }
  useConfirmation().question = `You are about to delete the user ${editUser.name} ${editUser.surname}`
  useConfirmation().visible = true;

}
</script>

<template>
  <div class="dialog-container">
    <Dialog v-model:visible="props.visible" modal>
      <template #container="{ closeCallback }">
        <div class="content-container" :class="{dark: isDark}">
          <div class="header">Update {{ editUser.name }} {{ editUser.surname }}</div>
          <div class="inputs">
            <label class="label" for="name">Name</label>
            <InputText id="name" v-model="editUser.name" optionLabel="name" :class="{empty: editUser.name === null}"/>
            <label class="label" for="surname">Surname</label>
            <InputText id="surname" v-model="editUser.surname" optionLabel="name" :class="{empty: editUser.surname === null}" />
            <label class="label" for="telephone">Phone</label>
            <InputText id="telephone" v-model="editUser.telephone" optionLabel="name" :class="{empty: editUser.telephone === null}" />
            <label class="label" for="email">E-Mail</label>
            <InputText id="email" v-model="editUser.email" optionLabel="name" :class="{empty: editUser.email === null}"  disabled="true"/>
            <label class="label" for="role_id">Role</label>
            <Dropdown id="role_id" v-model="editUser.role" :options="roles" optionLabel="name" :placeholder="(editUser.role?.name ?? '')" :class="{empty: editUser.role_id === null}" />
            <label class="label" for="department_id">Department</label>
            <Dropdown id="department_id" v-model="editUser.department" :options="departments" optionLabel="name" :placeholder="editUser.department?.name ?? ''" :class="{empty: editUser.department_id === null}" />
          </div>
          <div class="buttons">
            <Button button-type="submit" label="Update" @click="updateUser()"/>
            <Button button-type="cancel" label="Cancel" @click="closeModal"/>
            <Button button-type="deletion" label="Delete" @click="deleteUser()"/>
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
    flex-wrap: wrap;
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