<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useUiStore } from '../stores/uiStore';
import { rule, settingsSchema } from '../utils/validation';
import FormError from '../components/FormError.vue';
const user = useUserStore(); const ui = useUiStore();
const displayName = ref(user.currentUser?.settings.displayName ?? 'Студент');
const dark = ref(ui.isDark);
async function save(): Promise<void> { await user.saveSettings({ displayName: displayName.value, dark: dark.value }); }
</script>
<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-h4 q-mt-none">Настройки</h1>
        <FormError :error="ui.currentError" @retry="save" />
        <q-form class="q-gutter-md" @submit.prevent="save">
          <q-input v-model="displayName" label="Имя" outlined :rules="[rule(settingsSchema.shape.displayName)]" />
          <q-toggle v-model="dark" label="Тёмная тема" />
          <div><q-btn type="submit" color="primary" label="Сохранить" :loading="user.isBusy" /></div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>
