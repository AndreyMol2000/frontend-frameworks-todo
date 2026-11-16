<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useUiStore } from '../stores/uiStore';
import { safeRedirect } from '../router/guards';
import { emailSchema, passwordSchema, rule } from '../utils/validation';
import FormError from '../components/FormError.vue';
const user = useUserStore(); const ui = useUiStore();
const router = useRouter(); const route = useRoute();
const email = ref('student@example.com'); const password = ref('Demo1234!'); const register = ref(false);
async function send(): Promise<void> {
  if (await user.signIn({ email: email.value, password: password.value }, register.value)) await router.push(safeRedirect(route.query.redirect));
}
</script>
<template>
  <q-page padding class="row justify-center items-center">
    <q-card flat bordered class="col-12 col-sm-7 col-md-5 col-lg-3 q-pa-lg">
      <h1 class="text-h5 q-mt-none">{{ register ? 'Регистрация' : 'Вход в список задач' }}</h1>
      <p class="text-grey-7">Для входа используйте тестовые данные.</p>
      <FormError :error="ui.currentError" @retry="send" />
      <q-form class="q-gutter-sm" @submit.prevent="send">
        <q-input v-model="email" type="email" label="Email" outlined :rules="[rule(emailSchema)]" :disable="user.isBusy" />
        <q-input v-model="password" type="password" label="Пароль" outlined :rules="[rule(passwordSchema)]" :disable="user.isBusy" />
        <q-btn type="submit" color="primary" :label="register ? 'Создать аккаунт' : 'Войти'" :loading="user.isBusy" />
        <q-btn flat no-caps :label="register ? 'Уже есть аккаунт' : 'Регистрация'" :disable="user.isBusy" @click="register = !register; ui.clearError()" />
      </q-form>
      <p class="text-caption text-grey-7 q-mb-none q-mt-lg">Демо-вход: student@example.com / Demo1234!</p>
    </q-card>
  </q-page>
</template>
