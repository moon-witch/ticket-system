<script setup lang="ts">
import AverageTimeWidgetVue from '@/components/Widgets/AverageTimeWidget.vue';
import BestReviewsWidget from '@/components/Widgets/BestReviewsWidget.vue';
import MostHighPriorityWidget from '@/components/Widgets/MostHighPriorityWidget.vue';
import MostTicketsClosedWidget from '@/components/Widgets/MostTicketsClosedWidget.vue';
import MyTicketsWidget from '@/components/Widgets/MyTicketsWidget.vue'
import OpenTicketsWidget from '@/components/Widgets/OpenTicketsWidget.vue';
import { useDark } from '@vueuse/core';

const props = defineProps({
  user: {
    default: null
  }
})
const isDark = useDark()
</script>

<template>
  <main v-if="props.user" :class="{dark: isDark}">
    <div class="header">Dashboard</div>
    <div class="widget-wrap">
      <div>
        <div class="container-title">
          Stats
        </div>
        <div class="widget-container">
          <MyTicketsWidget></MyTicketsWidget>
          <OpenTicketsWidget />
          <AverageTimeWidgetVue />
        </div>
      </div>
      <div>
        <div class="container-title">
          Leaderboard
        </div>
        <div class="widget-container">
          <MostTicketsClosedWidget />
          <MostHighPriorityWidget />
          <BestReviewsWidget />
        </div>
      </div>
    </div>
  </main>
</template>


<style scoped lang="scss">
main {
  color: $text-light;

  .widget-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70dvh;
    gap: 5rem;
  }

  &.dark {
    color: $text-dark;
    .header {
      color: $text-dark;
    }
  }
}
.header {
  color: $text-light;
  margin: 3rem 0;
  text-align: center;
  font-size: calc($text-header * 1.3);
}

.container-title {
  font-size: $text-header;
  text-align: center;
  color: inherit;
  margin-bottom: 1rem;
}

.widget-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
}
</style>