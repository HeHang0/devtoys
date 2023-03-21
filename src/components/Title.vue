<template>
  <div class="devtoys-title">
    <div>
      <slot name="title"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
  
  <style lang="less" scoped>
.devtoys-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  div {
    display: flex;
  }
}
</style>
  