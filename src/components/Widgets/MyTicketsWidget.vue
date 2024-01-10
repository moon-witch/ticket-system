<script setup lang="ts">
import Widget from '@/components/Widgets/Widget.vue'
</script>

<template>
  <Widget>
    <template #title>My Tickets</template>
    <template #subtitle>This month</template>
    <template #default>
      <div class="container">
        <div class="ticket-count">
          <div>Open</div>
          <div>64</div>
        </div>
        <div class="ticket-count">
          <div>Closed</div>
          <div>64</div></div>
      </div>
    </template>
  </Widget>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-evenly;
}
</style>