<script setup lang="ts">
import type { ITodoItem } from '../types';
import TodoItem from './TodoItem.vue';
defineProps<{ todos: ITodoItem[]; busy: boolean }>();
defineEmits<{ toggle: [id: string]; delete: [id: string]; edit: [id: string] }>();
</script>
<template>
  <q-list bordered separator class="rounded-borders">
    <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" :busy="busy" @toggle="$emit('toggle', $event)" @delete="$emit('delete', $event)" @edit="$emit('edit', $event)" />
    </transition-group>
    <q-item v-if="todos.length === 0"><q-item-section class="text-grey-7 q-py-lg text-center">Задач пока нет. Добавьте задачу или измените фильтр.</q-item-section></q-item>
  </q-list>
</template>
