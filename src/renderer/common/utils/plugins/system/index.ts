import { NORMAL_PLUGIN } from './normal';

// Преобразование в формат JSON
// https://www.lambdatest.com/free-online-tools/json-escape
export const SystemPluginList = [
  {
    type: 'guide',
    title: 'Хочу внести вклад\nв Ленивый клиентский сервис',
    description: '',
    tags: [],
    icon: '📘',
  },
  {
    type: 'plugin',
    title: 'Базовый плагин диалога',
    author: 'Системный плагин',
    description:
      'Стандартный процесс ответа: в зависимости от настроек используется ответ по ключевым словам или ответ GPT.',
    tags: ['Системный'],
    code: NORMAL_PLUGIN,
    icon: '⚙️',
  },
];
