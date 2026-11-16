# Мои задачи

Список задач на Vue 3 и Quasar. Учебный проект по фронтенд-фреймворкам.

[Открыть сайт](https://andreymol2000.github.io/frontend-frameworks-todo/)

Можно добавлять, менять и удалять задачи, отмечать выполненные, искать по названию. Есть фильтры и тёмная тема.

Вход: `student@example.com`, пароль: `Demo1234!`.
Авторизация учебная. На сайте задачи сохраняются в текущем браузере.

## Запуск

Нужен Node.js 24 или новее.

```sh
npm ci
npm run dev
```

Адрес приложения: http://127.0.0.1:9000.

## Mock-сервер

Для работы с отдельным API скопировать `.env.example` в `.env.local`.
Запустить `npm run mock`, затем в другом терминале — `npm run dev`.
Для возврата к браузерному режиму поставить `VITE_API_MODE=browser` в `.env.local` и перезапустить приложение.

## Проверки и сборка

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Готовая сборка — в `dist/spa`. Покрытие тестами: `npm run test:coverage`.
После push в `main` сайт обновляется через GitHub Actions.
