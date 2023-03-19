<script lang="ts" setup>
interface Props {
  title: string;
  desc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
});
</script>
<template>
  <el-card class="dev-toys-setting-card">
    <template #header>
      <div class="dev-toys-setting-layout">
        <div class="dev-toys-setting-card-left">
          <el-icon class="dev-toys-setting-card-icon">
            <slot name="icon"></slot>
          </el-icon>
          <div class="dev-toys-setting-card-text">
            <span class="dev-toys-setting-card-title">
              {{ props.title }}
            </span>
            <span v-if="props.desc" class="dev-toys-setting-card-desc">
              {{ props.desc }}
            </span>
          </div>
        </div>
        <span class="dev-toys-setting-card-body">
          <slot></slot>
        </span>
      </div>
    </template>
  </el-card>
</template>
  
<style lang="less" scoped>
.dev-toys-setting-card {
  width: 100%;
  box-shadow: none;
  margin-bottom: 20px;

  .dev-toys-setting-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dev-toys-setting-card-left {
      display: flex;
      align-items: center;
      .dev-toys-setting-card-text {
        display: inline-flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        margin-left: 20px;
        font-size: var(--el-font-size-small);
      }
      .dev-toys-setting-card-icon {
        font-size: 25px;
        color: var(--el-text-color-secondary);
      }
      .dev-toys-setting-card-desc {
        color: var(--el-text-color-secondary);
        font-size: var(--el-font-size-extra-small);
      }
    }
  }
}
</style>
  
<style lang="less">
.dev-toys-setting-card {
  .el-card__header {
    border-bottom: 0;
    padding: 10px 20px;
  }
  .el-card__body {
    display: none;
  }
}
</style>
  