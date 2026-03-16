<template>
  <div class="virtual-table-container">
    <!-- Fixed Sticky Header -->
    <div class="virtual-table-header-wrapper">
      <!-- Wrapper cho header - không scroll -->
      <div class="virtual-table-header-inner">
        <table
          class="virtual-table-header"
          :style="{ marginLeft: -scrollLeft + 'px' }"
        >
          <thead>
            <tr>
              <th
                v-for="(column, idx) in columns"
                :key="`header-${idx}`"
                :style="{ width: '300px', minWidth: '300px' }"
                class="virtual-table-header-cell"
              >
                <slot :name="`header-${column.key}`" :column="column">
                  {{ column.label }}
                </slot>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>

    <!-- Main Virtual Scrollable Area -->
    <div
      class="virtual-table-wrapper"
      @scroll="handleScroll"
      ref="wrapperRef"
      :class="{ 'hide-scrollbar': !showVerticalScroll }"
    >
      <div class="virtual-table-inner" :style="{ width: contentWidth }">
        <!-- Spacer before visible rows -->
        <div :style="{ height: offsetY + 'px' }"></div>

        <!-- Virtual Rows -->
        <table class="virtual-table" :style="{ width: '100%' }">
          <tbody>
            <tr
              v-for="(item, rowIdx) in visibleItems"
              :key="`row-${startRow + rowIdx}`"
              class="virtual-table-row"
            >
              <td
                v-for="(column, colIdx) in columns"
                :key="`cell-${startRow + rowIdx}-${colIdx}`"
                :style="{ width: '300px', minWidth: '300px' }"
                class="virtual-table-cell"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="item"
                  :rowIndex="startRow + rowIdx"
                  :column="column"
                  :value="item[column.key as keyof typeof item]"
                >
                  {{ item[column.key as keyof typeof item] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Spacer after visible rows -->
        <div
          :style="{
            height: Math.max(0, totalHeight - offsetY - visibleHeight) + 'px',
          }"
        ></div>
      </div>
    </div>

    <!-- Horizontal Scrollbar Container - Chỉ hiển thị khi cần -->
    <div v-if="showHorizontalScroll" class="virtual-table-h-scroll-container">
      <div
        class="virtual-table-h-scroll"
        :style="{ width: contentWidth }"
        @scroll="handleHorizontalScroll"
        ref="hScrollRef"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";

interface Column {
  key: string;
  label: string;
  width: string | number;
}

interface VirtualTableProps {
  data: Record<string, any>[];
  columns: Column[];
  height: number;
  width?: string | number;
  rowHeight?: number;
}

const props = withDefaults(defineProps<VirtualTableProps>(), {
  rowHeight: 40,
  width: "100%",
});

const wrapperRef = ref<HTMLDivElement>();
const hScrollRef = ref<HTMLDivElement>();

const scrollTop = ref(0);
const scrollLeft = ref(0);
const visibleHeight = ref(0);
const containerWidth = ref(0);

// Tính toán các dòng visible
const startRow = computed(() => Math.floor(scrollTop.value / props.rowHeight));
const endRow = computed(() =>
  Math.ceil((scrollTop.value + visibleHeight.value) / props.rowHeight),
);
const visibleItems = computed(() =>
  props.data.slice(startRow.value, Math.min(endRow.value, props.data.length)),
);

const offsetY = computed(() => startRow.value * props.rowHeight);
const totalHeight = computed(() => props.data.length * props.rowHeight);

// Tính toán chiều rộng nội dung
const contentWidth = computed(() => {
  return props.columns.reduce((sum, col) => {
    const width =
      typeof col.width === "string" ? parseInt(col.width) : col.width;
    return sum + width;
  }, 0);
});

// Kiểm tra có cần scroll ngang
const showHorizontalScroll = computed(
  () => contentWidth.value > containerWidth.value,
);

// Kiểm tra có cần scroll dọc
const showVerticalScroll = computed(
  () => totalHeight.value > visibleHeight.value,
);

const columns = computed(() => props.columns);

// Xử lý scroll dọc & ngang từ main wrapper
const handleScroll = (e: Event) => {
  const target = e.target as HTMLDivElement;
  scrollTop.value = target.scrollTop;
  scrollLeft.value = target.scrollLeft;

  // Sync horizontal scroll bar
  if (
    hScrollRef.value &&
    Math.abs(hScrollRef.value.scrollLeft - scrollLeft.value) > 1
  ) {
    hScrollRef.value.scrollLeft = scrollLeft.value;
  }
};

// Xử lý scroll ngang từ thanh scroll ngang
const handleHorizontalScroll = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const newScrollLeft = target.scrollLeft;

  scrollLeft.value = newScrollLeft;

  // Sync main container scroll
  if (
    wrapperRef.value &&
    Math.abs(wrapperRef.value.scrollLeft - newScrollLeft) > 1
  ) {
    wrapperRef.value.scrollLeft = newScrollLeft;
  }
};

onMounted(() => {
  nextTick(() => {
    if (wrapperRef.value) {
      visibleHeight.value = wrapperRef.value.clientHeight;
      containerWidth.value = wrapperRef.value.clientWidth;

      // Smooth scroll behavior
      wrapperRef.value.style.scrollBehavior = "smooth";
      if (hScrollRef.value) {
        hScrollRef.value.style.scrollBehavior = "smooth";
      }
    }
  });
});

// Watch data changes
watch(
  () => props.data.length,
  () => {
    nextTick(() => {
      if (wrapperRef.value) {
        visibleHeight.value = wrapperRef.value.clientHeight;
      }
    });
  },
);
</script>

<style scoped>
.virtual-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  overflow: hidden;
}

/* ==================== HEADER STYLING ==================== */
.virtual-table-header-wrapper {
  flex-shrink: 0;
  border-bottom: 2px solid #404040;
  background-color: #0a0a0a;
  overflow: hidden;
  z-index: 10;
  position: relative;
}

.virtual-table-header-inner {
  overflow: hidden;
}

.virtual-table-header {
  width: 100%;
  border-collapse: collapse;
  background-color: #0a0a0a;
}

.virtual-table-header-cell {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #e0e0e0;
  border-right: 1px solid #404040;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #0a0a0a;
  position: sticky;
  top: 0;
  z-index: 10;
}

.virtual-table-header-cell:last-child {
  border-right: none;
}

/* ==================== MAIN TABLE WRAPPER ==================== */
.virtual-table-wrapper {
  flex: 1;
  overflow: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #646cff #1a1a1a;
}

/* Ẩn scrollbar dọc khi không cần */
.virtual-table-wrapper.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.virtual-table-wrapper.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Hiển thị scrollbar dọc khi cần */
.virtual-table-wrapper::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.virtual-table-wrapper::-webkit-scrollbar-thumb {
  background-color: #646cff;
  border-radius: 4px;
}

.virtual-table-wrapper::-webkit-scrollbar-track {
  background-color: #1a1a1a;
}

.virtual-table-inner {
  position: relative;
}

/* ==================== TABLE STYLING ==================== */
.virtual-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1a1a1a;
}

.virtual-table-row {
  border-bottom: 1px solid #404040;
  transition: background-color 0.15s ease;
  height: 40px;
}

.virtual-table-row:hover {
  background-color: #2a2a2a;
}

.virtual-table-cell {
  padding: 12px 16px;
  border-right: 1px solid #404040;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #b0b0b0;
  vertical-align: middle;
}

.virtual-table-cell:last-child {
  border-right: none;
}

/* ==================== HORIZONTAL SCROLLBAR ==================== */
.virtual-table-h-scroll-container {
  flex-shrink: 0;
  height: 12px;
  border-top: 1px solid #404040;
  background-color: #1a1a1a;
}

.virtual-table-h-scroll {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
}

.virtual-table-h-scroll::-webkit-scrollbar {
  height: 12px;
}

.virtual-table-h-scroll::-webkit-scrollbar-thumb {
  background-color: #646cff;
  border-radius: 6px;
}

.virtual-table-h-scroll::-webkit-scrollbar-track {
  background-color: #1a1a1a;
}

/* Firefox */
.virtual-table-h-scroll {
  scrollbar-width: thin;
  scrollbar-color: #646cff #1a1a1a;
}
</style>
