import fs from 'fs';
import ExcelJS from 'exceljs';
import { Op } from 'sequelize';
import { Message } from '../entities/message';
import { Session } from '../entities/session';
import { MessageDTO, ReplyDTO, Context } from '../types';
import { CTX_APP_ID, CTX_APP_NAME, CTX_INSTANCE_ID } from '../constants';
import { getTempPath } from '../../utils';

export class MessageController {
  /**
   * Сохранение сообщения
   * @param ctx
   * @param reply
   * @param messages
   */
  public async saveMessages(
    ctx: Context,
    reply: ReplyDTO,
    messages: MessageDTO[],
  ) {
    const appId = ctx.get(CTX_APP_ID);
    const instanceId = ctx.get(CTX_INSTANCE_ID);
    const appName = ctx.get(CTX_APP_NAME);

    if (!appId || !instanceId) {
      throw new Error('Invalid context');
    }

    // Сначала создаём сессию
    const session = await Session.create({
      platform: appName,
      platform_id: appId,
      instance_id: instanceId,
      created_at: new Date(),
      context: Array.from(ctx.entries()),
    });

    // Затем создаём сообщение
    const msgs = messages.map((msg) => {
      return {
        session_id: session.id,
        role: msg.role,
        content: msg.content,
        sender: msg.sender,
        type: msg.type,
        created_at: new Date(),
      };
    });

    msgs.push({
      session_id: session.id,
      role: 'SELF',
      content: reply.content,
      type: reply.type,
      sender: 'BOT',
      created_at: new Date(),
    });

    await Message.bulkCreate(msgs);
  }

  /**
   * Запрос диалоговых сессий
   * @param page текущая страница
   * @param pageSize размер страницы
   * @returns
   */
  public async getSessions({
    page = 0,
    pageSize = 10,
    keyword,
    platformId,
  }: {
    page: number;
    pageSize: number;
    keyword?: string;
    platformId?: string;
  }) {
    // Если есть ключевое слово, нужно запросить таблицу Message, получить session_id и затем запросить таблицу Session
    const kw = keyword?.trim();

    if (kw) {
      const messages = await Message.findAll({
        where: {
          content: {
            [Op.like]: `%${kw}%`,
          },
        },
      });

      const sessionIds = messages.map((msg) => msg.session_id);

      const where: any = {
        id: {
          [Op.in]: sessionIds,
        },
      };
      if (platformId) {
        where.platform_id = platformId;
      }

      return Session.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });
    }

    const where: any = {};
    if (platformId) {
      where.platform_id = platformId;
    }

    return Session.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  /**
   * Запрос сообщений чата
   * @param sessionId
   * @returns
   */
  public async getMessages(sessionId: number) {
    return Message.findAll({
      where: {
        session_id: sessionId,
      },
      order: [['created_at', 'ASC']],
    });
  }

  /**
   * Экспорт сообщений в Excel
   *
   * @returns
   */
  public async exportExcel() {
    const msgs = await Message.findAll({
      order: [['created_at', 'ASC']],
    });

    const data = msgs.map((msg) => ({
      id: msg.id,
      session_id: msg.session_id,
      role: msg.role,
      content: msg.content,
      sender: msg.sender,
      type: msg.type,
      created_at: msg.created_at,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Все сообщения');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Session ID', key: 'session_id', width: 10 },
      { header: 'Роль', key: 'role', width: 10 },
      { header: 'Содержимое', key: 'content', width: 50 },
      { header: 'Отправитель', key: 'sender', width: 10 },
      { header: 'Тип', key: 'type', width: 10 },
      { header: 'Время создания', key: 'created_at', width: 20 },
    ];

    worksheet.addRows(data);

    // Проверка существования папки excels, если не существует — создаём
    if (!fs.existsSync(`${getTempPath()}/excels`)) {
      fs.mkdirSync(`${getTempPath()}/excels`);
    }

    // Сохранение файла
    const filePath = `${getTempPath()}/excels/Все сообщения-${Date.now()}.xlsx`;
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }
}
