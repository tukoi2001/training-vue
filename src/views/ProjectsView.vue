<template>
  <div class="projects-container">
    <div class="projects-header">
      <button class="add-btn" @click="openCreateModal">+</button>
    </div>
    <div class="kanban-board">
      <ProjectColumn
        title="To Do"
        :count="workingProjects.length"
        :projects="workingProjects"
        status="working"
        @edit="openEditModal"
        @delete="handleDelete"
      />
      <ProjectColumn
        title="In Progress"
        :count="inProgressProjects.length"
        :projects="inProgressProjects"
        status="inProgress"
        @edit="openEditModal"
        @delete="handleDelete"
      />
      <ProjectColumn
        title="Completed"
        :count="completedProjects.length"
        :projects="completedProjects"
        status="completed"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>
  </div>

  <!-- Drag Ghost Element -->
  <div
    v-if="dragGhost.visible"
    class="drag-ghost"
    :style="{
      left: dragGhost.x + 'px',
      top: dragGhost.y + 'px',
    }"
  >
    <div class="ghost-card">
      <h4>{{ dragGhost.project?.title }}</h4>
      <div class="ghost-tags">
        <span
          v-for="tag in dragGhost.project?.tags"
          :key="tag"
          class="ghost-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>

  <!-- Create Project Modal (teleported to body) -->
  <teleport to="body">
    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click.self="closeCreateModal"
    >
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header class="modal-header">
          <h3 id="modal-title">Create Project</h3>
          <button
            class="modal-close"
            @click="closeCreateModal"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form class="modal-body" @submit.prevent="submitCreate">
          <label class="field">
            <span>Title</span>
            <input v-model="form.title" type="text" required maxlength="120" />
          </label>

          <label class="field">
            <span>Description</span>
            <textarea
              v-model="form.description"
              rows="4"
              maxlength="500"
            ></textarea>
          </label>

          <label class="field">
            <span>Tags (comma separated)</span>
            <input
              v-model="form.tags"
              type="text"
              placeholder="eg. IOS APP, ANDROID"
            />
          </label>

          <footer class="modal-actions">
            <button
              type="button"
              class="btn btn-muted"
              @click="closeCreateModal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Create</button>
          </footer>
        </form>
      </div>
    </div>
  </teleport>

  <!-- Update Project Modal (teleported to body) -->
  <teleport to="body">
    <div
      v-if="showEditModal"
      class="modal-overlay"
      @click.self="closeEditModal"
    >
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <header class="modal-header">
          <h3 id="edit-modal-title">Update Project</h3>
          <button
            class="modal-close"
            @click="closeEditModal"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form class="modal-body" @submit.prevent="submitUpdate">
          <label class="field">
            <span>Title</span>
            <input
              v-model="editForm.title"
              type="text"
              required
              maxlength="120"
            />
          </label>

          <label class="field">
            <span>Description</span>
            <textarea
              v-model="editForm.description"
              rows="4"
              maxlength="500"
            ></textarea>
          </label>

          <label class="field">
            <span>Tags (comma separated)</span>
            <input
              v-model="editForm.tags"
              type="text"
              placeholder="eg. IOS APP, ANDROID"
            />
          </label>

          <footer class="modal-actions">
            <button type="button" class="btn btn-muted" @click="closeEditModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Update</button>
          </footer>
        </form>
      </div>
    </div>
  </teleport>

  <teleport to="body">
    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click.self="closeDeleteModal"
    >
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <header class="modal-header">
          <h3 id="delete-modal-title">Delete Project</h3>
          <button
            class="modal-close"
            @click="closeDeleteModal"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <p>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>

          <footer class="modal-actions">
            <button
              type="button"
              class="btn btn-muted"
              @click="closeDeleteModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="confirmDelete"
            >
              Delete
            </button>
          </footer>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import type { Project } from '@/types';
import ProjectColumn from '@/components/ProjectColumn.vue';

const projectStore = useProjectStore();

const showDeleteModal = ref(false);
const deletingProjectId = ref<string | null>(null);

const workingProjects = computed(
  () => projectStore.getProjectsByStatus('working').value,
);
const inProgressProjects = computed(
  () => projectStore.getProjectsByStatus('inProgress').value,
);
const completedProjects = computed(
  () => projectStore.getProjectsByStatus('completed').value,
);

// Create modal
const showCreateModal = ref(false);

const form = reactive({
  title: '',
  description: '',
  tags: '',
});

const openCreateModal = () => {
  form.title = '';
  form.description = '';
  form.tags = '';
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

watch(showCreateModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

watch(showDeleteModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

const submitCreate = () => {
  const title = form.title?.trim();
  if (!title) return; // guard

  const tags = form.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  projectStore.addProject({
    title,
    description: form.description?.trim() ?? '',
    status: 'working',
    tags,
    attachments: 0,
    comments: 0,
    members: [],
  });

  closeCreateModal();
};

// Update modal
const showEditModal = ref(false);
const editingProject = ref<Project | null>(null);

const editForm = reactive({
  id: '',
  title: '',
  description: '',
  tags: '',
  status: '' as Project['status'],
});

const openEditModal = (project: Project) => {
  editingProject.value = project;
  editForm.id = project.id;
  editForm.title = project.title;
  editForm.description = project.description;
  editForm.tags = project.tags.join(', ');
  editForm.status = project.status;
  showEditModal.value = true;
};

const openDeleteModal = (id: string) => {
  deletingProjectId.value = id;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  deletingProjectId.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = () => {
  if (!deletingProjectId.value) return;
  projectStore.deleteProject(deletingProjectId.value);
  closeDeleteModal();
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingProject.value = null;
};

const submitUpdate = () => {
  if (!editingProject.value) return;
  const title = editForm.title?.trim();
  if (!title) return;

  const tags = editForm.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  projectStore.updateProject(editForm.id, {
    title,
    description: editForm.description?.trim() ?? '',
    tags,
    status: editForm.status,
  });

  closeEditModal();
};

const handleDelete = (id: string) => {
  openDeleteModal(id);
};

const dragGhost = reactive({
  visible: false,
  x: 0,
  y: 0,
  project: null as Project | null,
});

const handleDragStart = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.card');

  if (card) {
    const projectId = card.getAttribute('data-project-id');
    if (projectId) {
      const project = projectStore.projects.find((p) => p.id === projectId);
      if (project) {
        dragGhost.project = project;
        dragGhost.visible = true;
        dragGhost.x = e.clientX + 10;
        dragGhost.y = e.clientY + 10;
      }
    }
  }
};

const handleDragMove = (e: DragEvent) => {
  if (dragGhost.visible) {
    dragGhost.x = e.clientX + 10;
    dragGhost.y = e.clientY + 10;
  }
};

const handleDragEnd = () => {
  dragGhost.visible = false;
  dragGhost.project = null;
};

onMounted(() => {
  // Listen for native drag events so we can render the drag ghost
  window.addEventListener('dragstart', handleDragStart);
  // 'dragover' fires continuously during drag; preventDefault to allow drops
  window.addEventListener('dragover', handleDragMove);
  window.addEventListener('dragend', handleDragEnd);
  // Also handle drop to ensure ghost is cleared if drop happens outside
  window.addEventListener('drop', handleDragEnd);

  // Close modal on Escape
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showCreateModal.value) closeCreateModal();
      if (showEditModal.value) closeEditModal();
      if (showDeleteModal.value) closeDeleteModal();
    }
  };
  window.addEventListener('keydown', onKey);
  onUnmounted(() => {
    window.removeEventListener('keydown', onKey);
  });
});

onUnmounted(() => {
  window.removeEventListener('dragstart', handleDragStart);
  window.removeEventListener('dragover', handleDragMove);
  window.removeEventListener('dragend', handleDragEnd);
  window.removeEventListener('drop', handleDragEnd);
});
</script>

<style scoped>
.projects-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

/* Add button */
.add-btn {
  background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 20px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.18);
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;
  user-select: none;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(99, 102, 241, 0.22);
}

.add-btn:active {
  transform: translateY(0);
  opacity: 0.95;
}

.add-btn:focus {
  outline: 2px solid rgba(99, 102, 241, 0.18);
  outline-offset: 2px;
}

/* Drag ghost */
.drag-ghost {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -50%);
}

.ghost-card {
  min-width: 220px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 12px;
  opacity: 0.95;
}

.ghost-card h4 {
  margin: 0 0 8px;
  font-size: 14px;
}

.ghost-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ghost-tag {
  background: #eef2ff;
  color: #3b82f6;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

/* Modal styles (teleported) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field span {
  display: block;
  font-size: 13px;
  color: #444;
  margin-bottom: 6px;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn-muted {
  background: #f3f4f6;
  color: #111827;
}
.btn-primary {
  background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
  color: #fff;
}
</style>
