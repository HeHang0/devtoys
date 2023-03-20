<template>
  <div class="dev-toys-title">
    <div>
      <slot name="title"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
  
  <style lang="less" scoped>
.dev-toys-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  div {
    display: flex;
  }
}
</style>
  