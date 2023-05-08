<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import Pickr from '@simonwep/pickr';
import { useLanguageStore } from '../stores/language';
import { usePageStore } from '../stores/page';
import Title from '@/components/Title.vue';
import '@simonwep/pickr/dist/themes/nano.min.css';
const { t } = useLanguageStore();
const page = usePageStore();
const textColorPickerRef = ref();
const backColorPickerRef = ref();

var textColorPicker: Pickr | null = null;
var backColorPicker: Pickr | null = null;

onUnmounted(() => {
  textColorPicker && textColorPicker.destroyAndRemove();
  backColorPicker && backColorPicker.destroyAndRemove();
});
onMounted(() => {
  nextTick(() => {
    let config = {
      useAsButton: true, // 直接展示
      showAlways: true,
      inline: true,

      components: {
        // 可选颜色
        palette: false,
        // 箭头选择器
        hue: true,
        // 透明度选择器
        opacity: true,
        // 颜色值
        preview: true,
        // 自定义颜色
        interaction: {
          rgba: true,
          hex: true,
          hsva: true,
          cmyk: true,
          // hsla: true,
          input: true
          // clear: true,
          // save: true,
        }
      }
    };
    textColorPicker = Pickr.create({
      el: textColorPickerRef.value,
      default: page.color.color,
      theme: 'nano', // 自定义主题
      ...config
    }).on('change', (color: any) => {
      page.colorChange(color.toHEXA().toString(), page.color.background);
    });
    backColorPicker = Pickr.create({
      el: backColorPickerRef.value,
      default: page.color.background,
      theme: 'nano', // 自定义主题
      ...config
    }).on('change', (color: any) => {
      page.colorChange(page.color.color, color.toHEXA().toString());
    });
  });
});
</script>

<template>
  <div class="devtoys-color-picker">
    <div class="devtoys-color-picker-body">
      <div class="devtoys-color-picker-body-color">
        <Title>
          <template #title>
            {{ t('Selected Color') }}
          </template>
        </Title>
        <div
          class="devtoys-color-picker-body-color-sel"
          :style="{
            color: page.color.color,
            backgroundColor: page.color.background
          }">
          哈哈哈哈哈哈哈哈哈哈哈
        </div>
      </div>
      <div class="devtoys-color-picker-body-contrast">
        <Title>
          <template #title>
            {{ t('Contrast') }} {{ page.color.contrast }}
          </template>
        </Title>
        <div class="devtoys-color-picker-body-contrast-layout">
          <div
            class="devtoys-color-picker-body-contrast-sel devtoys-color-picker-body-contrast-sel-helper"></div>
          <div
            class="devtoys-color-picker-body-contrast-sel"
            :style="{
              opacity: page.color.opacity
            }"></div>
        </div>
      </div>
    </div>
    <div class="devtoys-color-picker-body">
      <div class="devtoys-color-picker-body-text">
        <Title>
          <template #title>
            {{ t('Text Color') }}
          </template>
        </Title>
        <div ref="textColorPickerRef"></div>
      </div>
      <div class="devtoys-color-picker-body-back">
        <Title>
          <template #title>
            {{ t('Background Color') }}
          </template>
        </Title>
        <div ref="backColorPickerRef"></div>
      </div>
    </div>
    <div class="devtoys-color-picker-body-pickr"></div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-color-picker {
  &-body {
    display: flex;

    & > div {
      flex: 1;
      margin-bottom: 20px;
    }
    &-pickr {
      display: flex;
    }

    & > div:nth-child(1) {
      margin-right: 5px;
    }

    & > div:nth-child(2) {
      margin-left: 5px;
    }

    @media (max-width: 850px) {
      flex-direction: column;

      & > div:nth-child(1) {
        margin-right: 0;
      }

      & > div:nth-child(2) {
        margin-left: 0;
      }
    }

    &-color {
      &-sel {
        width: 100%;
      }
    }

    &-contrast {
      &-sel {
        flex: 1;
        height: 100%;
        border-radius: var(--el-border-radius-base);
        background-color: green;
      }
      &-sel-helper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: var(--el-border-radius-base);
        background-color: red;
      }

      &-layout {
        width: 100%;
        height: 80px;
        border-radius: var(--el-border-radius-base);
        position: relative;
      }
    }

    &-color {
      &-sel {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--el-border-radius-base);
        text-align: center;
      }
    }
  }
}
</style>
<style>
.pcr-picker {
  z-index: 1;
}
.devtoys-color-picker-body > div > .pcr-app {
  width: 100%;
}
</style>
