<script setup lang="ts">
import { Operation, Sunny, Moon } from '@element-plus/icons-vue';
import SettingCard from '@/components/SettingCard.vue';
import IconLanguage from '@/components/icons/IconLanguage.vue';
import MapIcon from '@/assets/icons/MapIcon.vue';
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
    <SettingCard
      :title="t('Editor Wrap')"
      :desc="t('Check the text editor wrap you want to use.')">
      <template #icon>
        <span class="devtoys-icon"> &#x0122; </span>
      </template>
      <el-checkbox
        v-model="settings.editorWrap"
        size="small"
        @change="settings.editorWrapChange">
      </el-checkbox>
    </SettingCard>
    <SettingCard
      :title="t('ImageProxy')"
      :desc="t('Input the markdown image proxy address.')">
      <template #icon>
        <span class="devtoys-icon"> &#x0127; </span>
      </template>
      <el-input
        v-model="settings.imageProxy"
        size="small"
        @change="settings.setImageProxy">
      </el-input>
    </SettingCard>
    <SettingCard
      :title="t('MapType')"
      :desc="t('Select the map type you want to use.')">
      <template #icon>
        <span class="devtoys-icon">
          <MapIcon />
        </span>
      </template>
      <span style="display: inline-flex; flex-wrap: wrap; gap: 10px">
        <el-select
          style="margin-right: 10px; width: auto"
          v-model="settings.mapType"
          size="small"
          @change="settings.mapKeyChange">
          <el-option :label="t('Google Map')" value="google" />
          <el-option :label="t('Amap Map')" value="amap" />
          <el-option :label="t('Maptiler')" value="maptiler" />
        </el-select>
        <el-input
          v-if="settings.mapType === 'google'"
          v-model="settings.mapKeyGoogle"
          size="small"
          @change="settings.mapKeyGoogleChange"
          :title="t('Map Key Google')"
          :placeholder="t('Map Key Google')">
        </el-input>
        <el-input
          v-else-if="settings.mapType === 'amap'"
          v-model="settings.mapKeyAmap"
          size="small"
          @change="settings.mapKeyAmapChange"
          :title="t('Map Key Amap')"
          :placeholder="t('Map Key Amap')">
        </el-input>
        <el-input
          v-else-if="settings.mapType === 'maptiler'"
          v-model="settings.mapKeyMaptiler"
          size="small"
          @change="settings.mapKeyMaptilerChange"
          :title="t('Map Key Maptiler')"
          :placeholder="t('Map Key Maptiler')">
        </el-input>
        <!-- <el-input
          v-if="settings.mapType === 'amap'"
          v-model="settings.mapKeyAmapSecret"
          size="small"
          @change="settings.mapKeyAmapSecretChange"
          :title="t('Map Key Amap Secret')"
          :placeholder="t('Map Key Amap Secret')">
        </el-input> -->
      </span>
    </SettingCard>
  </div>
</template>
