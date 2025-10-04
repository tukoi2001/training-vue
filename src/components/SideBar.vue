<template>
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-icon">LS</div>
    </div>

    <nav class="nav-menu">
      <router-link to="/" class="nav-item">
        <span class="icon">⊞</span>
        <span>DASHBOARD</span>
      </router-link>
      <router-link to="/projects" class="nav-item">
        <span class="icon">📁</span>
        <span>PROJECTS</span>
      </router-link>
      <router-link to="/tasks" class="nav-item">
        <span class="icon">☰</span>
        <span>MY TASK</span>
      </router-link>
      <router-link to="/calendar" class="nav-item">
        <span class="icon">📅</span>
        <span>CALENDAR</span>
      </router-link>
      <router-link to="/time" class="nav-item">
        <span class="icon">⏱</span>
        <span>TIME MANAGE</span>
      </router-link>
      <router-link to="/reports" class="nav-item">
        <span class="icon">📊</span>
        <span>REPORTS</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <span class="icon">⚙</span>
        <span>SETTINGS</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  flex: 0 0 240px;
  height: 100vh;
  background: white;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.logo {
  padding: 0 24px 32px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  border-radius: 8px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  text-decoration: none;
  color: #888;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f8f8f8;
  color: #333;
}

.nav-item.router-link-exact-active {
  color: #ff8555;
  background: #fff4ed;
  border-left-color: #ff8555;
}

.nav-item .icon {
  font-size: 18px;
}
</style>
