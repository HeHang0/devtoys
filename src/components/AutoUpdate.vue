<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Refresh } from '@element-plus/icons-vue';
import { useLanguageStore } from '@/stores/language';
import { ElMessageBox } from 'element-plus';
const { t } = useLanguageStore();
const router = useRouter();
const indexUrl = location.origin + router.options.history.base;
const jsPattern = /src="[\S]+assets\/index\-([a-z0-9]+)\.js"/;
const second = 1000;
let lastHash = '';
let checkTimeout: any = null;

async function startCheck() {
  const remoteHash = await fetchHash(`?t=${new Date().valueOf()}`);
  if (lastHash && remoteHash && lastHash != remoteHash) {
    ElMessageBox.confirm(t('New Version Message'), t('New Version Available'), {
      confirmButtonText: t('Update Now'),
      cancelButtonText: t('Later'),
      type: 'success',
      icon: Refresh
    })
      .then(() => {
        location.href = indexUrl + `?t=${new Date().valueOf()}`;
      })
      .catch()
      .finally(() => {
        clearTimeout(checkTimeout);
      });
  } else {
    setTimeout(startCheck, 2 * second);
  }
}

async function initHash() {
  lastHash = await fetchHash();
  if (!lastHash) return;
  setTimeout(startCheck, 60 * second);
}

async function fetchHash(params?: string) {
  try {
    const resp = await fetch(indexUrl + (params || ''));
    const text = await resp.text();
    if (jsPattern.test(text)) {
      const match = jsPattern.exec(text);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {}
  return '';
}

onMounted(initHash);
</script>

<template></template>
