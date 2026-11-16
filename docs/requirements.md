# Разбор заданий курса

Источник: письменные практики 1–11 в [модуле 5–6 семестров](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/schedule), раздел «Фреймворки Frontend разработки», 6 семестр. Дата проверки: 16.11.2026.

Записи лекций и практик не просмотрены целиком. Выводы о требованиях основаны на опубликованных текстах заданий. Отдельная форма итоговой работы и порядок сдачи в проверенном модуле не обнаружены: раздел «Практика» показывает отсутствие практических заданий.

| Практика | Требование | Реализация |
|---|---|---|
| [1](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368790) | Vue 3, Quasar, TS strict, layout, router, Pinia | `quasar.config.js`, `tsconfig.json`, `src/layouts`, `src/router`, `src/stores` |
| [2](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368792) | TodoForm, TodoItem, TodoList, типизированные props/emits, дата, пустой список | `src/components`, `src/pages/IndexPage.vue` |
| [3](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368793) | localStorage, фильтры, поиск, анимация | `useLocalStorage.ts`, `useTodoFilter.ts`, Quasar fadeIn/fadeOut |
| [4](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368797) | Типы, сервис задач, runtime-валидация, ошибки | `src/types`, `src/services/todoService.ts`, Zod, `errorHandling.ts` |
| [5](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368799) | TodoStore, UserStore, UIStore, персистентность | `src/stores`, CRUD в actions, getters для компонентов |
| [6](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368800) | `/`, `/settings`, `/login`, `/404`, guards, layouts, lazy loading, breadcrumbs | `src/router`, `src/layouts`, `src/pages` |
| [7](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368970) | json-server, users/todos/tags, auth, маршруты, задержки, CORS, proxy | `mock/db.json`, `routes.json`, `middlewares/auth.js`, `server.cjs`, общий `engine.ts` |
| [8](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368971) | Axios, login/register/refresh/profile/settings, retry, кэш, loading | `src/services`, `useAsync.ts`, `useApi.ts`; GET retry, обновление access token, кэш списка на 30 секунд |
| [9](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368972) | Валидация форм и API, уникальность email, FormError, журнал ошибок | Zod, `useValidation.ts`, `FormError.vue`, `mockSentry`, `src/main.ts` |
| [10](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368973) | Vitest + Vue Test Utils, успехи/ошибки/границы, покрытие ≥80%, CI | `tests`, `vitest.config.ts`, workflow |
| [11](https://netology.ru/profile/program/bhebdps-sfr-23-vv-5/lessons/595402/lesson_items/3368977) | Сборка, Pages, Actions, lazy loading, SEO, анализ бандла, Lighthouse | Успешный CI и deploy подтверждены [запуском №2](https://github.com/AndreyMol2000/frontend-frameworks-todo/actions/runs/43819631153); Lighthouse Performance публичного сайта 94 |

## Уточнения по формулировкам заданий

- Практика 2 требует `<script setup lang="ts">`; он и используется вместо необязательной рекомендации `defineComponent` из практики 1.
- Собственный CSS не используется. Простое оформление — Quasar utilities и стандартные компоненты.
- В практиках 7–8 требуется работающий отдельный backend. Он есть локально. Для статического Pages используется дополнительный автономный adapter с тем же контрактом, а не обращение к несуществующему серверу.
- JWT — учебная имитация с проверкой срока, типа и пользователя; не криптографически защищённая production-авторизация.
- Sentry — локальный mock с обезличенными событиями. Метрика LCP сохраняется локально в sessionStorage.
- В задании упомянут webpack-bundle-analyzer, но требуется Vite/Quasar. Здесь отчёт строится по результату Vite с gzip-размерами.
- `_redirects` не работает на GitHub Pages; корректные прямые переходы и перезагрузки обеспечиваются hash-mode Vue Router.

Окончательную оценку выставляет преподаватель. Наличие выполненных письменных практик не подтверждает зачёт и не заменяет уточнение способа отправки.
