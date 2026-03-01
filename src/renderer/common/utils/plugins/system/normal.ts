export const NORMAL_PLUGIN = `const cc = require('config_srv');
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
