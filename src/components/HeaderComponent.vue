<template>
  <header class="header">
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Search" />
    </div>

    <div class="header-actions">
      <button class="notification-btn">
        <span>🔔</span>
      </button>
      <div class="user-avatar">
        <img src="https://i.pravatar.cc/40?img=1" alt="User" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f5f5f5;
  padding: 12px 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  color: #888;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}

.notification-btn:hover {
  background: #ebebeb;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
