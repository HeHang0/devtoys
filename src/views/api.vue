<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import Editor from '@/components/Editor.vue';
import { usePageStore, type KV, HttpContentType } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import { useSettingsStore } from '../stores/settings';
import { parseUrl } from '@/utils/utils';
const settings = useSettingsStore();
const page = usePageStore();
const { t } = useLanguageStore();
const loading = ref(false);

function addHeader() {
  page.api.headers.push({ key: '', value: '' });
}

function removeHeader(item: KV) {
  const index = page.api.headers.findIndex(m => m === item);
  if (index >= 0) {
    page.api.headers.splice(index, 1);
  }
}

function addParams() {
  page.api.urlParams.push({ key: '', value: '' });
}

function removeParams(item: KV) {
  const index = page.api.urlParams.findIndex(m => m === item);
  if (index >= 0) {
    page.api.urlParams.splice(index, 1);
  }
}

function addBodyParams() {
  page.api.bodyParams.push({ key: '', value: '' });
}

function removeBodyParams(item: KV) {
  const index = page.api.bodyParams.findIndex(m => m === item);
  if (index >= 0) {
    page.api.bodyParams.splice(index, 1);
  }
}

function parseLanguage(contentType: string) {
  if (contentType.includes('json')) {
    return 'json';
  } else if (contentType.includes('xml')) {
    return 'xml';
  } else {
    return 'text';
  }
}

function sendRequest() {
  const requestUrl = parseUrl(page.api.address);
  const requestParams = requestUrl.params
    .concat(page.api.urlParams)
    .map(m => `${encodeURIComponent(m.key)}=${encodeURIComponent(m.value)}`)
    .join('&');
  const requestHeader: { [key: string]: string } = {};
  page.api.headers.map(m => {
    requestHeader[m.key] = m.value;
  });
  const requestAddress = `${requestUrl.protocol}//${requestUrl.host}${
    requestUrl.pathname
  }${requestParams && '?'}${requestParams}`;
  let requestBody = page.api.bodyText;
  if (page.api.method !== 'GET' && page.api.bodyType === HttpContentType.Form) {
    requestBody = page.api.bodyParams
      .map(m => `${encodeURIComponent(m.key)}=${encodeURIComponent(m.value)}`)
      .join('&');
  }
  loading.value = true;
  fetch(requestAddress, {
    method: page.api.method,
    body: (page.api.method !== 'GET' && requestBody) || undefined
  })
    .then(r => {
      page.api.responseGeneral.splice(0, page.api.responseGeneral.length);
      page.api.responseGeneral.push({
        key: 'Request URL',
        value: requestAddress
      });
      page.api.responseGeneral.push({
        key: 'Request Method',
        value: page.api.method
      });
      page.api.responseGeneral.push({
        key: 'Status Code',
        value: `${r.status}`
      });
      page.api.responseHeaders.splice(0, page.api.responseHeaders.length);
      r.headers.forEach((value, key) => {
        page.api.responseHeaders.push({
          key,
          value
        });
      });
      return r.text();
    })
    .then(r => {
      page.api.responseText = r;
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="devtoys-api" v-loading="loading">
    <el-form
      label-width="120px"
      :label-position="settings.mobile ? 'top' : 'left'">
      <el-form-item :label="t('Address')">
        <el-input v-model="page.api.address" />
        <el-button type="primary" @click="sendRequest">{{
          t('Send')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="t('Request Method')">
        <el-radio-group v-model="page.api.method">
          <el-radio-button label="GET" />
          <el-radio-button label="POST" />
          <el-radio-button label="PUT" />
          <el-radio-button label="DELETE" />
        </el-radio-group>
      </el-form-item>
      <el-form-item class="devtoys-api-multi-line">
        <template #label>
          {{ t('Request Headers') }}
          <el-button size="small" :icon="Plus" @click="addHeader"></el-button>
        </template>
        <div class="devtoys-api-line" v-for="item in page.api.headers">
          <el-input v-model="item.key" />
          <el-input v-model="item.value" />
          <el-button :icon="Minus" @click="removeHeader(item)"></el-button>
        </div>
      </el-form-item>
      <el-form-item class="devtoys-api-multi-line">
        <template #label>
          {{ t('Request Params') }}
          <el-button size="small" :icon="Plus" @click="addParams"></el-button>
        </template>
        <div class="devtoys-api-line" v-for="item in page.api.urlParams">
          <el-input v-model="item.key" />
          <el-input v-model="item.value" />
          <el-button :icon="Minus" @click="removeParams(item)"></el-button>
        </div>
      </el-form-item>
      <el-form-item
        v-if="
          page.api.method !== 'GET' &&
          page.api.bodyType === HttpContentType.Form
        "
        class="devtoys-api-multi-line">
        <template #label>
          {{ t('Request Body') }}
          <el-button
            size="small"
            :icon="Plus"
            @click="addBodyParams"></el-button>
        </template>
        <div class="devtoys-api-line">
          <el-radio-group
            v-model="page.api.bodyType"
            class="devtoys-api-body-type">
            <el-radio-button :label="HttpContentType.Form" />
            <el-radio-button :label="HttpContentType.Json" />
            <el-radio-button :label="HttpContentType.Text" />
            <el-radio-button :label="HttpContentType.Xml" />
          </el-radio-group>
        </div>
        <div class="devtoys-api-line" v-for="item in page.api.bodyParams">
          <el-input v-model="item.key" />
          <el-input v-model="item.value" />
          <el-button :icon="Minus" @click="removeBodyParams(item)"></el-button>
        </div>
      </el-form-item>
      <el-form-item
        v-else-if="page.api.method !== 'GET'"
        :label="t('Request Body')"
        class="devtoys-api-multi-line">
        <div class="devtoys-api-line">
          <el-radio-group
            v-model="page.api.bodyType"
            class="devtoys-api-body-type">
            <el-radio-button :label="HttpContentType.Form" />
            <el-radio-button :label="HttpContentType.Json" />
            <el-radio-button :label="HttpContentType.Text" />
            <el-radio-button :label="HttpContentType.Xml" />
          </el-radio-group>
        </div>
        <div class="devtoys-api-body-editor devtoys-api-line">
          <Editor
            v-model:value="page.api.bodyText"
            :language="parseLanguage(page.api.bodyType)">
            <!-- <template #operate> </template> -->
          </Editor>
        </div>
      </el-form-item>
      <el-form-item :label="t('Response')" class="devtoys-api-multi-line">
        <el-collapse>
          <el-collapse-item title="General" name="1">
            <div v-for="item in page.api.responseGeneral">
              {{ item.key }}: {{ item.value }}
            </div>
          </el-collapse-item>
          <el-collapse-item title="Headers" name="2">
            <div v-for="item in page.api.responseHeaders">
              {{ item.key }}: {{ item.value }}
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="devtoys-api-response-editor devtoys-api-line">
          <Editor v-model:value="page.api.responseText" readonly>
            <!-- <template #operate> </template> -->
          </Editor>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.el-input {
  flex: 1;
}
.el-button {
  margin-left: 10px;
}
:deep(.el-form-item__label) {
  justify-content: space-between;
  align-items: center;
}
.devtoys-api-multi-line {
  :deep(.el-form-item__content) {
    display: block;
  }
}
.devtoys-api-line {
  display: flex;
  align-items: center;
  .el-input + .el-input {
    margin-left: 10px;
  }
}
.devtoys-api-line + .devtoys-api-line {
  margin-top: 5px;
}
.devtoys-api-body-editor {
  height: 300px;
}
.devtoys-api-response-editor {
  height: 500px;
}
@media (max-width: 850px) {
  .devtoys-api-body-type {
    display: inline-flex;
    flex-wrap: nowrap;
    flex-direction: column;
    .el-radio-button {
      width: 100%;
      :deep(.el-radio-button__inner) {
        width: 100%;
        border-left: var(--el-border);
        border-top: 0;
      }
    }
    .el-radio-button:last-child {
      :deep(.el-radio-button__inner) {
        border-radius: 0 0 var(--el-border-radius-base)
          var(--el-border-radius-base);
      }
    }
    .el-radio-button:first-child {
      :deep(.el-radio-button__inner) {
        border-top: var(--el-border);
        border-radius: var(--el-border-radius-base) var(--el-border-radius-base)
          0 0;
      }
    }
  }
}
</style>
