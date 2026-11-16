<script setup lang="ts">
import { date } from 'quasar';
import type { ITodoItem } from '../types';
defineProps<{ todo: ITodoItem; busy: boolean }>();
defineEmits<{ toggle: [id: string]; delete: [id: string]; edit: [id: string] }>();
</script>
<template>
  <q-item :class="todo.completed ? 'text-grey-6' : ''">
    <q-item-section side><q-checkbox :model-value="todo.completed" :disable="busy" :aria-label="`Выполнено: ${todo.title}`" @update:model-value="$emit('toggle', todo.id)" /></q-item-section>
    <q-item-section>
      <q-item-label :class="todo.completed ? 'text-strike' : ''">{{ todo.title }}</q-item-label>
      <q-item-label caption>{{ date.formatDate(todo.createdAt, 'DD/MM/YYYY') }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="row no-wrap">
        <q-btn flat round dense icon="edit" :disable="busy" :aria-label="`Изменить: ${todo.title}`" @click="$emit('edit', todo.id)"><q-tooltip>Изменить</q-tooltip></q-btn>
        <q-btn flat round dense color="negative" icon="delete_outline" :disable="busy" :aria-label="`Удалить: ${todo.title}`" @click="$emit('delete', todo.id)"><q-tooltip>Удалить</q-tooltip></q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>
