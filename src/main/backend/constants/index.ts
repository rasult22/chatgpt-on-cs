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

export const PluginDefaultRunCode = `
const cc = require('config_srv');
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
