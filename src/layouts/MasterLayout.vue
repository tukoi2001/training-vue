<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <HeaderComponent />
      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/SideBar.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1 1 auto;
}

.content-area {
  padding: 20px;
  height: calc(100vh - 72px);
  overflow-y: auto;
}
</style>
