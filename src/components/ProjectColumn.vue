<template>
  <div class="column">
    <div class="column-header">
      <h3>
        {{ title }}
        <span class="count">({{ String(count).padStart(2, '0') }})</span>
      </h3>
      <button class="more-btn">⋯</button>
    </div>

    <div
      class="projects-list"
      :class="{ 'drag-over': isDragOver }"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @dragstart="onDragStart($event)"
        @edit="onEdit"
        @delete="onDelete"
      />
      <div v-if="projects.length === 0" class="empty-column">
        <p>Drop projects here</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Project, ProjectStatus } from '@/types';
import { useProjectStore } from '@/stores/projectStore';
import ProjectCard from './ProjectCard.vue';

const props = defineProps<{
  title: string;
  count: number;
  projects: Project[];
  status: ProjectStatus;
}>();

// forward events to parent (ProjectsView)
const emit = defineEmits<{
  (e: 'edit', project: Project): void;
  (e: 'delete', id: string): void;
}>();

const projectStore = useProjectStore();
const isDragOver = ref(false);

const onDragStart = ({
  event,
  project,
}: {
  event: DragEvent;
  project: Project;
}) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('projectId', project.id);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDragEnter = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const onDragLeave = (event: DragEvent) => {
  if (event.currentTarget === event.target) {
    isDragOver.value = false;
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (event.dataTransfer) {
    const projectId = event.dataTransfer.getData('projectId');
    if (projectId) {
      projectStore.updateProject(projectId, { status: props.status });
    }
  }
};

const onEdit = (project: Project) => {
  emit('edit', project);
};

const onDelete = (id: string) => {
  emit('delete', id);
};

// Ensure drag-over state is cleared when dragging ends or a drop happens outside this column
const clearDragOver = () => {
  isDragOver.value = false;
};

onMounted(() => {
  window.addEventListener('dragend', clearDragOver);
  window.addEventListener('drop', clearDragOver);
});

onUnmounted(() => {
  window.removeEventListener('dragend', clearDragOver);
  window.removeEventListener('drop', clearDragOver);
});
</script>

<style scoped>
.column {
  height: 100%;
  background: transparent;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.column-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.count {
  color: #888;
  font-weight: 400;
}

.more-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #888;
  padding: 4px 8px;
}

.more-btn:hover {
  color: #333;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 200px;
  height: 100%;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.2s;
}

.projects-list.drag-over {
  background: #f0f8ff;
  border: 2px dashed #40a9ff;
}

.empty-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #ccc;
  font-size: 14px;
  border: 1px dashed #ccc;
  border-radius: 8px;
}
</style>
