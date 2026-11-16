<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { Dialog } from 'quasar';
import { useTodoStore } from '../stores/todoStore';
import { useUiStore } from '../stores/uiStore';
import { rule, titleSchema } from '../utils/validation';
import TodoForm from '../components/TodoForm.vue';
import TodoList from '../components/TodoList.vue';
import FormError from '../components/FormError.vue';
const todos = useTodoStore();
const ui = useUiStore();
const controller = new AbortController();
const filters = [{ label: 'Все', value: 'all' }, { label: 'Активные', value: 'active' }, { label: 'Готовые', value: 'completed' }];
onMounted(() => { void todos.load(false, controller.signal); });
onBeforeUnmount(() => controller.abort());
function edit(id: string): void {
  const todo = todos.filteredTodos.find((item) => item.id === id);
  if (!todo) return;
  Dialog.create({ title: 'Изменить задачу', prompt: { model: todo.title, type: 'text', isValid: (value: string) => rule(titleSchema)(value) === true }, cancel: 'Отмена', ok: 'Сохранить' }).onOk((title: string) => { void todos.update(id, { title }); });
}
</script>
<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-h4 q-mt-none q-mb-sm">Мои задачи</h1>
        <p class="text-grey-7 q-mb-lg">Выполнено {{ todos.stats.completed }} из {{ todos.stats.total }}</p>
        <FormError :error="ui.currentError" @retry="todos.load(true)" />
        <TodoForm :busy="todos.isBusy" :submit="todos.add" />
        <div class="row q-col-gutter-sm items-start q-mb-md">
          <div class="col-12 col-sm"><q-input :model-value="todos.searchQuery" outlined dense clearable label="Поиск задач" @update:model-value="todos.setSearch(String($event ?? ''))" /></div>
          <div class="col-12 col-sm-auto"><q-btn-toggle :model-value="todos.currentFilter" :options="filters" no-caps unelevated toggle-color="primary" @update:model-value="todos.setFilter" /></div>
        </div>
        <q-linear-progress v-if="todos.isBusy" indeterminate class="q-mb-sm" aria-label="Загрузка" />
        <TodoList :todos="todos.filteredTodos" :busy="todos.isBusy" @toggle="todos.toggle" @delete="todos.remove" @edit="edit" />
      </div>
    </div>
  </q-page>
</template>
