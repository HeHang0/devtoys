<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import Pickr from '@simonwep/pickr'
import { useLanguageStore } from "../stores/language";
import { usePageStore } from "../stores/page";
import '@simonwep/pickr/dist/themes/nano.min.css';
const { t } = useLanguageStore();
const page = usePageStore();
const textColorPickerRef = ref();
const backColorPickerRef = ref();

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
          input: true,
          // clear: true,
          // save: true,
        },
      }
    }
    Pickr.create({
      el: textColorPickerRef.value,
      default: page.color.color,
      theme: 'nano', // 自定义主题
      ...config
    }).on('change', (color: any) => {
      page.colorChange(color.toRGBA(), page.color.background)
    })
    Pickr.create({
      el: backColorPickerRef.value,
      default: page.color.background,
      theme: 'nano', // 自定义主题
      ...config
    }).on('change', (color: any) => {
      page.colorChange(page.color.color, color.toRGBA())
    })
  })
})
</script>

<template>
  <div class="devtoys-color-picker">
    <!-- <SettingCard :title="t('显示方式')">
      <template #icon>
        <span class="devtoys-icon"> &#x134; </span>
      </template>
      <el-select size="small">
        <el-option :label="t('HLS')" value="HLS" />
        <el-option :label="t('HSV')" value="HSV" />
      </el-select>
    </SettingCard> -->
    <div class="devtoys-color-picker-body">
      <div class="devtoys-color-picker-body-color">
        <Title>
          <template #title>
            {{ t("所选颜色") }}
          </template>
        </Title>
        <div class="devtoys-color-picker-body-color-sel"
          :style="{ color: page.color.color, backgroundColor: page.color.background }">哈哈哈哈哈哈哈哈哈哈哈</div>
      </div>
      <div class="devtoys-color-picker-body-contrast">
        <Title>
          <template #title>
            {{ t("对比度") }}
          </template>
        </Title>
        <div class="devtoys-color-picker-body-contrast-layout">
          <div class="devtoys-color-picker-body-contrast-sel"
            :style="{ backgroundColor: page.color.success ? 'green' : 'red' }">哈哈哈哈哈哈哈哈哈哈哈</div>
          <!-- <div class="devtoys-color-picker-body-contrast-sel"
            :style="{ backgroundColor: page.color.success2 ? 'green' : 'red' }">哈哈哈哈哈哈哈哈哈哈哈</div>
          <div class="devtoys-color-picker-body-contrast-sel"
            :style="{ backgroundColor: page.color.success3 ? 'green' : 'red' }">哈哈哈哈哈哈哈哈哈哈哈</div>
          <div class="devtoys-color-picker-body-contrast-sel"
            :style="{ backgroundColor: page.color.success4 ? 'green' : 'red' }">哈哈哈哈哈哈哈哈哈哈哈</div> -->
        </div>
      </div>
    </div>
    <div class="devtoys-color-picker-body">
      <div class="devtoys-color-picker-body-text">
        <Title>
          <template #title>
            {{ t("文本颜色") }}
          </template>
        </Title>
        <div ref="textColorPickerRef"></div>
      </div>
      <div class="devtoys-color-picker-body-back">
        <Title>
          <template #title>
            {{ t("背景颜色") }}
          </template>
        </Title>
        <div ref="backColorPickerRef"></div>
      </div>
    </div>
    <div class="devtoys-color-picker-body-pickr">
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-color-picker {
  &-body {
    display: flex;

    &>div {
      flex: 1;
      margin-bottom: 20px;
    }
    &-pickr {
      display: flex;
    }

    &>div:nth-child(1) {
      margin-right: 5px;
    }

    &>div:nth-child(2) {
      margin-left: 5px;
    }

    @media(max-width:850px) {
      flex-direction: column;

      &>div:nth-child(1) {
        margin-right: 0;
      }

      &>div:nth-child(2) {
        margin-left: 0;
      }
    }

    &-color {
      &-sel {
        width: 100%;
      }
    }

    &-contrast {
      color: white;

      &-sel {
        width: 100%;
      }

      &-layout {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }

    &-color,
    &-contrast {

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
.devtoys-color-picker-body>div>.pcr-app {
  width: 100%;
}
</style>