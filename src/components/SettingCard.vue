<script lang="ts" setup>
interface Props {
  title: string;
  desc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
});
</script>
<template>
  <el-card class="devtoys-setting-card">
    <template #header>
      <div class="devtoys-setting-layout">
        <div class="devtoys-setting-card-left">
          <el-icon class="devtoys-setting-card-icon">
            <slot name="icon"></slot>
          </el-icon>
          <div class="devtoys-setting-card-text">
            <span class="devtoys-setting-card-title">
              {{ props.title }}
            </span>
            <span v-if="props.desc" class="devtoys-setting-card-desc">
              {{ props.desc }}
            </span>
          </div>
        </div>
        <span class="devtoys-setting-card-body">
          <slot></slot>
        </span>
      </div>
    </template>
  </el-card>
</template>

<style lang="less" scoped>
.devtoys-setting-card {
  width: 100%;
  box-shadow: none;
  margin-bottom: 20px;

  .devtoys-setting-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .devtoys-setting-card-left {
      display: flex;
      align-items: center;
      min-width: 200px;
      .devtoys-setting-card-text {
        display: inline-flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        margin-left: 20px;
        font-size: var(--el-font-size-small);
      }
      .devtoys-setting-card-icon {
        font-size: 25px;
        color: var(--el-text-color-secondary);
      }
      .devtoys-setting-card-desc {
        color: var(--el-text-color-secondary);
        font-size: var(--el-font-size-extra-small);
      }
    }
  }
  :deep(.devtoys-setting-card-body) {
    .el-input--small {
      width: 155px;
    }
  }
  :deep(.el-card__header) {
    border-bottom: 0;
    padding: 10px 20px;
  }
  :deep(.el-card__body) {
    display: none;
  }
  @media (max-width: 850px) {
    :deep(.devtoys-setting-card-left) {
      flex: 0.6;
    }
    :deep(.devtoys-setting-card-body) {
      flex: 0.4;
      margin-left: 10px;
      text-align: right;
    }
  }
}
</style>
