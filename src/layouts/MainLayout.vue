<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUiStore } from '../stores/uiStore';
import { useUserStore } from '../stores/userStore';
import { useTodoStore } from '../stores/todoStore';
const ui = useUiStore();
const user = useUserStore();
const todos = useTodoStore();
const route = useRoute();
const router = useRouter();
async function logout(): Promise<void> { user.logout(); todos.reset(); await router.push('/login'); }
</script>
<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round icon="menu" aria-label="Меню" @click="ui.setDrawer(!ui.drawerOpen)" />
        <q-toolbar-title>Мои задачи</q-toolbar-title>
        <q-btn flat label="Выйти" @click="logout" />
      </q-toolbar>
    </q-header>
    <q-drawer :model-value="ui.drawerOpen" bordered @update:model-value="ui.setDrawer">
      <q-list padding>
        <q-item><q-item-section><q-item-label>{{ user.currentUser?.settings.displayName }}</q-item-label><q-item-label caption>{{ user.currentUser?.email }}</q-item-label></q-item-section></q-item>
        <q-separator />
        <q-item clickable to="/" exact @click="ui.setDrawer(false)"><q-item-section>Задачи</q-item-section></q-item>
        <q-item clickable to="/settings" @click="ui.setDrawer(false)"><q-item-section>Настройки</q-item-section></q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <div class="q-pa-md">
        <q-breadcrumbs class="q-mb-md"><q-breadcrumbs-el label="Задачи" to="/" /><q-breadcrumbs-el v-if="route.name !== 'home'" :label="String(route.meta.title)" /></q-breadcrumbs>
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>
