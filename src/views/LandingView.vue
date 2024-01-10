<script setup lang="ts">
import {onMounted} from "vue";
import {useAccountStore} from "@/stores/accounts";
import CompanyBanner from "@/components/CompanyBanner.vue";

const props = defineProps({
  user: {
    required: true
  }
})

onMounted(async () => {
  await useAccountStore().getCurrentUserRole()
})
</script>

<template>
  <div class="landing-container">
    <CompanyBanner />
  </div>
</template>

<style scoped lang="scss">
.landing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>