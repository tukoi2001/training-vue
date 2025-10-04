import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import MasterLayout from '@/layouts/MasterLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MasterLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: '/projects',
        name: 'Projects',
        component: () => import('@/views/ProjectsView.vue'),
      },
      {
        path: '/tasks',
        name: 'MyTasks',
        component: () => import('@/views/TasksView.vue'),
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('@/views/CalendarView.vue'),
      },
      {
        path: '/time',
        name: 'TimeManage',
        component: () => import('@/views/TimeManageView.vue'),
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/views/ReportsView.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
