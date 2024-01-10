<script setup lang="ts">
import { useDark } from '@vueuse/core';

const isDark = useDark()
</script>

<template>
    <div class="widget" :class="{dark: isDark}">
        <div class="head">
            <div class="title">
                <slot name="title"></slot>
            </div>
            <div class="subtitle">
                <slot name="subtitle"></slot>
            </div>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .widget {
        height: 11rem;
        width: 18rem;

        background-color: $bg-light;
        border-radius: $radius-standard;
        
        padding: 1rem;
        margin: 0.5rem;

        text-align: center;

        .head {
            min-height: 3.5rem;
          margin: 1rem 0;
        }
        
        
        .title {
            font-size: $text-header;
            
        }
        
        .subtitle {
            font-size: $text-subheader;
            color: $text-sub-light;
        }

      .content {
        font-size: $text;
      }

        &.dark {
            background-color: $bg-dark;
            color: $text-dark;
            
            .subtitle {
                color: $text-sub-dark;
            }
        }

        .test {
            justify-self: center;
        }
    }
</style>