<script setup lang="ts">
import {useDark} from "@vueuse/core";
import {onMounted, ref, watch} from "vue";
import {useAccountStore} from "@/stores/accounts";

const isDark = useDark()

const props = defineProps({
  customerId: {
    required: true
  }
})

const customerData = ref<Record<string, any>[]>([])

watch(props, async () => {
  if (props.customerId != '0' && props.customerId !== null) {
    await useAccountStore().getSingleCustomer(String(props.customerId))
    customerData.value = useAccountStore().singleCustomer
  }
})
</script>

<template>
  <div class="customer-container">
    <div class="header">Customer info</div>
    <div class="data">
      <div class="point">
        <div class="title">Name</div>
        {{ customerData[0] ? customerData[0].name : 'unknown'}}
      </div>
      <div class="point">
        <div class="title">Email</div>
        {{ customerData[0] ? customerData[0].email : 'unknown' }}
      </div>
      <div class="point">
        <div class="title">Phone</div>
        {{ customerData[0] ? customerData[0].telephone : 'unknown' }}
      </div>
      <div class="point">
        <div class="title">User since</div>
        {{ customerData[0] ? new Date(customerData[0].creation_date).toLocaleString() : 'unknown' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.customer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  .header {
    font-size: $text;
    text-align: center;
    margin-bottom: 2rem;
  }

  .data {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .point {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;

      .title {
        font-weight: bold;
      }
    }
  }
}
</style>