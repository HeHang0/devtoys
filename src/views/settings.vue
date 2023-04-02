<script setup lang="ts">
import { Operation, Sunny, Moon } from '@element-plus/icons-vue';
import SettingCard from '@/components/SettingCard.vue';
import IconLanguage from '@/components/icons/IconLanguage.vue';
import { useLanguageStore, Language } from '@/stores/language';
import { useSettingsStore, AppTheme, EditorType } from '@/stores/settings';
import { ref } from 'vue';
const language = useLanguageStore();
const settings = useSettingsStore();
const { t } = language;
const fonts = [
  'Arial',
  'Helvetica',
  'sans-serif',
  'Arial Black',
  'Gadget',
  'Bookman Old Style',
  'serif',
  'Comic Sans MS',
  'cursive',
  'Courier',
  'monospace',
  'Courier New',
  'Garamond',
  'Georgia',
  'Impact',
  'Charcoal',
  'Lucida Console',
  'Monaco',
  'Lucida Sans Unicode',
  'Lucida Grande',
  'MS Sans Serif',
  'Geneva',
  'MS Serif',
  'New York',
  'Palatino Linotype',
  'Book Antiqua',
  'Palatino',
  'Symbol',
  'Tahoma',
  'Times New Roman',
  'Times',
  'Trebuchet MS',
  'Verdana',
  'Webdings',
  'Wingdings',
  'Zapf Dingbats'
];
const fontFamily = ref(settings.fontFamily);
function fontChange() {
  const result = settings.setFontFamily(fontFamily.value);
  fontFamily.value = result.length > 0 ? result : [''];
}
function clearFontFamily() {
  settings.setFontFamily(['']);
  fontFamily.value = [''];
}
</script>

<template>
  <div class="devtoys-settings">
    <SettingCard
      :title="t('App Theme')"
      :desc="
        t(
          'Choose your preferred theme to change the look and feel of the interface.'
        )
      ">
      <template #icon>
        <Operation />
      </template>
      <el-select
        :model-value="settings.appTheme"
        size="small"
        @change="settings.appThemeChange">
        <el-option :label="t('Auto Mode')" :value="AppTheme.Auto" />
        <el-option :label="t('Light Mode')" :value="AppTheme.Light" />
        <el-option :label="t('Dark Mode')" :value="AppTheme.Dark" />
      </el-select>
    </SettingCard>
    <SettingCard
      :title="t('Language')"
      :desc="t('Choose the language you want to use.')">
      <template #icon>
        <IconLanguage />
      </template>
      <el-select
        :model-value="language.locale"
        size="small"
        @change="language.changeLanguage">
        <el-option :label="t('Auto Mode')" :value="Language.Auto" />
        <el-option label="简体中文" :value="Language.ZhCN" />
        <el-option label="English" :value="Language.EnUS" />
        <el-option label="日本語" :value="Language.JA" />
      </el-select>
    </SettingCard>
    <SettingCard
      :title="t('Font')"
      :desc="t('Choose the font you want to use.')">
      <template #icon>
        <span class="devtoys-icon"> &#x132; </span>
      </template>
      <el-select
        v-model="fontFamily"
        size="small"
        @change="fontChange"
        multiple>
        <el-option :label="t('Default')" value="" @click="clearFontFamily" />
        <el-option
          v-for="font in fonts"
          :label="font"
          :value="font"
          :key="font" />
      </el-select>
    </SettingCard>
    <SettingCard
      :title="t('Text Editor')"
      :desc="t('Choose the text editor you want to use.')">
      <template #icon>
        <span class="devtoys-icon"> &#x0122; </span>
      </template>
      <el-select
        v-model="settings.editorType"
        size="small"
        @change="settings.editorTypeChange">
        <el-option :label="t(EditorType.Default)" :value="EditorType.Default" />
        <el-option
          :label="EditorType.PicaPicoEditor"
          :value="EditorType.PicaPicoEditor" />
        <el-option
          :label="EditorType.MonacoEditor"
          :value="EditorType.MonacoEditor" />
      </el-select>
    </SettingCard>
  </div>
</template>
