<template>
  <div
    class="card"
    :class="{ dragging: isDragging }"
    :data-project-id="project.id"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="card-header">
      <h4>{{ project.title }}</h4>

      <div class="more">
        <button class="more-btn" @click.stop="toggleMenu">⋯</button>

        <div v-if="showMenu" class="more-popover" @click.stop>
          <button class="popover-item" @click="onEdit">Edit</button>
          <button class="popover-item danger" @click="onDelete">Delete</button>
        </div>
      </div>
    </div>

    <p class="description">{{ project.description }}</p>

    <div v-if="project.image" class="card-image">
      <div class="placeholder-image">📱</div>
    </div>

    <div class="tags">
      <span
        v-for="tag in project.tags"
        :key="tag"
        class="tag"
        :class="getTagClass(tag)"
      >
        {{ tag }}
      </span>
    </div>

    <div class="card-footer">
      <div class="meta">
        <span class="meta-item">📎 {{ project.attachments }}</span>
        <span class="meta-item">💬 {{ project.comments }}</span>
      </div>
      <div class="members">
        <div
          v-for="(member, index) in project.members.slice(0, 3)"
          :key="member"
          class="member-avatar"
          :style="{ zIndex: 10 - index }"
        >
          <img
            :src="`https://i.pravatar.cc/32?img=${index + 10}`"
            :alt="member"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Project } from '@/types';

const props = defineProps<{
  project: Project;
}>();

const emit = defineEmits<{
  dragstart: [{ project: Project; event: DragEvent }];
  edit: [Project];
  delete: [string];
}>();

const isDragging = ref(false);
const showMenu = ref(false);

const onDragStart = (event: DragEvent) => {
  isDragging.value = true;

  // Hide default drag ghost
  if (event.dataTransfer) {
    const img = new Image();
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  emit('dragstart', { project: props.project, event });
};

const onDragEnd = () => {
  isDragging.value = false;
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const closeMenu = () => {
  showMenu.value = false;
};

const onEdit = () => {
  closeMenu();
  emit('edit', props.project);
};

const onDelete = () => {
  closeMenu();
  emit('delete', props.project.id);
};

onMounted(() => {
  const onDocClick = () => closeMenu();
  document.addEventListener('click', onDocClick);
  onUnmounted(() => document.removeEventListener('click', onDocClick));
});

const getTagClass = (tag: string): string => {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('ios') || tagLower.includes('android'))
    return 'tag-mobile';
  if (tagLower.includes('website')) return 'tag-web';
  if (tagLower.includes('branding')) return 'tag-brand';
  return 'tag-other';
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  cursor: grab;
}

.card:active {
  cursor: grabbing;
}

.card.dragging {
  opacity: 0.3;
  transform: scale(0.95);
  cursor: grabbing;
}

.card:hover:not(.dragging) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.more {
  position: relative;
}
.more-popover {
  position: absolute;
  right: 0;
  top: 34px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-width: 120px;
  z-index: 50;
  display: flex;
  flex-direction: column;
}
.popover-item {
  padding: 8px 12px;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}
.popover-item:hover {
  background: #f3f4f6;
}
.popover-item.danger {
  color: #b91c1c;
}

.more-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #ccc;
  padding: 4px;
}

.more-btn:hover {
  color: #888;
}

.description {
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-image {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-mobile {
  background: #fff0e6;
  color: #ff8555;
}

.tag-web {
  background: #e6f7ff;
  color: #40a9ff;
}

.tag-brand {
  background: #f0e6ff;
  color: #9254de;
}

.tag-other {
  background: #f0f0f0;
  color: #666;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.meta {
  display: flex;
  gap: 12px;
}

.meta-item {
  font-size: 13px;
  color: #888;
}

.members {
  display: flex;
  margin-left: auto;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  margin-left: -8px;
}

.member-avatar:first-child {
  margin-left: 0;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
