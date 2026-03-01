export const PluginExtraLib = `
      type AppContext = {
        CTX_APP_NAME: string; // Название текущего приложения
        CTX_APP_ID: string; // ID текущего приложения
        CTX_INSTANCE_ID: string; // ID текущего экземпляра оператора
        CTX_USERNAME?: string; // Имя текущего пользователя
        CTX_PLATFORM?: string; // Текущая платформа
        CTX_HAS_NEW_MESSAGE?: boolean; // Есть ли новые сообщения
        CTX_HAS_GROUP_MESSAGE?: boolean; // Есть ли групповые сообщения
        CTX_CURRENT_GOODS?: string; // Текущий товар
        CTX_CURRENT_GOODS_ID?: string; // ID текущего товара
        CTX_MEMBER_TAG?: string; // Тег участника
        CTX_FAN_TAG?: string; // Тег подписчика
        CTX_NEW_CUSTOMER_TAG?: string; // Тег нового клиента
        CTX_ORDER_STATUS?: string; // Статус заказа
        CTX_ORDER_ID?: string; // ID заказа
        CTX_ORDER_AMOUNT?: string; // Специфично для PDD [сумма заказа]
        CTX_GOODS_SPEC?: string; // Специфично для PDD [характеристики товара]
        CTX_LOGISTICS_STATUS?: string; // Статус доставки
      };

      type RoleType = 'SELF' | 'OTHER' | 'SYSTEM';

      type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'NO_REPLY';

      type Message = {
        sender: string; // Отправитель
        content: string; // Содержимое сообщения
        role: RoleType; // Роль отправителя
        type: MessageType; // Тип сообщения
      };

      type Reply = {
        content: string; // Содержимое ответа
        type: MessageType; // Тип ответа
      };
      `;

export const PluginExampleCode = `const cc = require('config_srv');
const rp = require('reply_srv');

/**
 * Главная функция плагина
 * @param {AppContext} ctx - Информация о контексте
 * @param {Message[]} messages - Массив сообщений
 * @returns {Reply} Результат выполнения плагина
 */
async function main(ctx, messages) {
  const cfg = await cc.get(ctx);
  return await rp.getReply(cfg, ctx, messages);
}`;

export const LLMTypeList = [
  {
    key: 'openai',
    name: 'OpenAI',
  },
  {
    key: 'ernie',
    name: 'Модель Wenxin (Baidu)',
  },
  {
    key: 'gemini',
    name: 'Google Gemini',
  },
  {
    key: 'hunyuan',
    name: 'Tencent Hunyuan',
  },
  {
    key: 'minimax',
    name: 'MiniMax',
  },
  {
    key: 'qwen',
    name: 'Tongyi Qianwen (Alibaba)',
  },
  {
    key: 'spark',
    name: 'Spark',
  },
  {
    key: 'vyro',
    name: 'Vyro AI',
  },
  {
    key: 'dify',
    name: 'Dify AI',
  },
  {
    key: 'fastgpt',
    name: 'FastGPT',
  },
];

export const ModelList = [
  {
    key: 'gpt-4',
    name: 'OpenAI GPT-4',
  },
  {
    key: 'gpt-3.5-turbo',
    name: 'OpenAI GPT-3.5 Turbo',
  },
  {
    key: 'claude-3',
    name: 'Anthropic Claude 3',
  },
  {
    key: 'gemini-1.5-pro',
    name: 'Google Gemini 1.5 Pro',
  },
  {
    key: 'bard',
    name: 'Google Bard',
  },
  {
    key: 'vicuna-1.3',
    name: 'Vicuna 1.3',
  },
  {
    key: 'palm-2',
    name: 'Google PaLM 2',
  },
  {
    key: 'llama-2',
    name: 'Meta LLaMA 2',
  },
  {
    key: 'dolly',
    name: 'Databricks Dolly',
  },
  {
    key: 'open-assistant',
    name: 'Open Assistant',
  },
  {
    key: 'mixtral-8x7b',
    name: 'Mistral Mixtral-8x7B',
  },
  {
    key: 'falcon-180b',
    name: 'Falcon 180B',
  },
  {
    key: 'wenxin-3.0',
    name: 'Baidu Wenxin 3.0 (Ernie)',
  },
  {
    key: 'm6',
    name: 'Alibaba M6',
  },
  {
    key: 'pangubot',
    name: 'Tencent PanguBot',
  },
  {
    key: 'huaweilinxi',
    name: 'Huawei Linxi AI',
  },
  {
    key: 'ziya-1.0',
    name: 'Ziya 1.0 (Zhipu AI)',
  },
  {
    key: 'imagebind',
    name: 'Meta ImageBind',
  },
  {
    key: 'gen-2',
    name: 'Runway Gen-2',
  },
];

// Фиксированные параметры контекста
export const CTX_APP_NAME = 'CTX_APP_NAME';
export const CTX_APP_ID = 'CTX_APP_ID';
export const CTX_INSTANCE_ID = 'CTX_INSTANCE_ID';

export const CTX_USERNAME = 'CTX_USERNAME'; // Имя текущего пользователя
export const CTX_PLATFORM = 'CTX_PLATFORM'; // Текущая платформа
export const CTX_HAS_NEW_MESSAGE = 'CTX_HAS_NEW_MESSAGE'; // Есть ли новые сообщения
export const CTX_HAS_GROUP_MESSAGE = 'CTX_HAS_GROUP_MESSAGE'; // Есть ли групповые сообщения

// Платформа электронной коммерции
export const CTX_CURRENT_GOODS = 'CTX_CURRENT_GOODS'; // Текущий товар
export const CTX_CURRENT_GOODS_ID = 'CTX_CURRENT_GOODS_ID'; // ID текущего товара
export const CTX_MEMBER_TAG = 'CTX_MEMBER_TAG'; // Тег участника
export const CTX_FAN_TAG = 'CTX_FAN_TAG'; // Тег подписчика
export const CTX_NEW_CUSTOMER_TAG = 'CTX_NEW_CUSTOMER_TAG'; // Тег нового клиента

export const CTX_ORDER_STATUS = 'CTX_ORDER_STATUS'; // Статус заказа
export const CTX_ORDER_ID = 'CTX_ORDER_ID'; // ID заказа
export const CTX_ORDER_AMOUNT = 'CTX_ORDER_AMOUNT'; // Специфично для PDD [сумма заказа]
export const CTX_GOODS_SPEC = 'CTX_GOODS_SPEC'; // Специфично для PDD [характеристики товара]
export const CTX_LOGISTICS_STATUS = 'CTX_LOGISTICS_STATUS'; // Статус доставки

export const ContextKeys = [
  CTX_APP_NAME,
  CTX_APP_ID,
  CTX_INSTANCE_ID,
  CTX_USERNAME,
  CTX_PLATFORM,
  CTX_HAS_NEW_MESSAGE,
  CTX_HAS_GROUP_MESSAGE,
  CTX_CURRENT_GOODS,
  CTX_CURRENT_GOODS_ID,
  CTX_MEMBER_TAG,
  CTX_FAN_TAG,
  CTX_NEW_CUSTOMER_TAG,
  CTX_ORDER_STATUS,
  CTX_ORDER_ID,
  CTX_ORDER_AMOUNT,
  CTX_GOODS_SPEC,
  CTX_LOGISTICS_STATUS,
];

export const MockCtx = new Map<string, string>([
  [CTX_APP_NAME, 'mock'],
  [CTX_APP_ID, 'mock_app_id'],
  [CTX_INSTANCE_ID, 'mock_instance_id'],
]);

export const MockMessages = [
  {
    sender: 'Пользователь SELF',
    content: 'Это тестовое сообщение',
    role: 'SELF',
    type: 'TEXT',
  },
  {
    sender: 'Уведомление SYSTEM',
    content: 'Это системное сообщение',
    role: 'SYSTEM',
    type: 'TEXT',
  },
  {
    sender: 'Пользователь OTHER',
    content: 'Это тестовое сообщение',
    role: 'OTHER',
    type: 'TEXT',
  },
];
