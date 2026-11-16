<script setup lang="ts">
import type { AppError } from '../types';
defineProps<{ error: AppError | null }>();
defineEmits<{ retry: [] }>();
</script>
<template>
  <q-banner v-if="error" class="bg-red-1 text-negative rounded-borders q-mb-md" role="alert">
    {{ error.message }}
    <template #action><q-btn v-if="error.retryable" flat label="Повторить" @click="$emit('retry')" /></template>
  </q-banner>
</template>
