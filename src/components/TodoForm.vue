<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { QForm } from 'quasar';
import { rule, titleSchema } from '../utils/validation';
defineProps<{ busy: boolean; submit: (title: string) => Promise<boolean> }>();
const title = ref('');
const form = ref<QForm | null>(null);
async function send(submit: (title: string) => Promise<boolean>): Promise<void> {
  if (await submit(title.value)) { title.value = ''; await nextTick(); form.value?.resetValidation(); }
}
</script>
<template>
  <q-form ref="form" class="row q-col-gutter-sm q-mb-md" @submit.prevent="send(submit)">
    <q-input v-model="title" class="col-12 col-sm" outlined label="Новая задача" maxlength="120" :rules="[rule(titleSchema)]" :disable="busy" />
    <div class="col-12 col-sm-auto"><q-btn type="submit" color="primary" label="Добавить" :loading="busy" /></div>
  </q-form>
</template>
