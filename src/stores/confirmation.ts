import { defineStore } from "pinia";
import { ref } from "vue";

export const useConfirmation = defineStore('confirmation', () => {

  const visible = ref(false);
  
  const title = ref<string>('Confirmation Required');
  const question = ref<string>('Are you sure?')
  
  const confirm = ref<Function>(() => {});
  const deny = ref<Function>(() => {});
  const confirmText = ref<string | undefined>();
  const denyText = ref<string | undefined>();

  const reset = () => {
    visible.value = false;
    title.value = 'Confirmation Required';
    question.value = 'Are you sure?';
    confirm.value = () => {};
    deny.value = () => {};
    confirmText.value = 'Yes';
    denyText.value = 'No';
  }

  const userConfirmed = async () => {
    await confirm.value();
    reset();
  }

  const userDenied = async () => {
    await deny.value();
    reset();
  }

  return {
    visible, 
    title, question, confirmText, confirm, denyText, deny,
    userConfirmed, userDenied
  }
})