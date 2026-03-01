import { Sequelize, Transaction } from 'sequelize';
import { DispatchService } from './dispatchService';
import { Instance } from '../entities/instance';
import { Config } from '../entities/config';
import { Plugin } from '../entities/plugin';

export class AppService {
  private dispatchService: DispatchService;

  private sequelize: Sequelize;

  constructor(dispatchService: DispatchService, sequelize: Sequelize) {
    this.dispatchService = dispatchService;
    this.sequelize = sequelize;
  }

  public async getTasks(): Promise<
    {
      task_id: string;
      env_id: string;
      app_id: string;
    }[]
  > {
    const instances = await Instance.findAll();
    return instances.map((instance) => ({
      task_id: String(instance.id),
      env_id: instance.env_id,
      app_id: instance.app_id,
    }));
  }

  /**
   * Инициализация всех задач
   */
  public async initTasks(): Promise<void> {
    const instances = await Instance.findAll();
    await this.dispatchService.updateTasks(instances);
  }

  /**
   * Добавление задачи
   */
  public async addTask(appId: string): Promise<Instance | null> {
    // Использование транзакции
    return this.sequelize
      .transaction(async (t: Transaction) => {
        const instance = await Instance.create(
          {
            app_id: appId,
            created_at: new Date(),
          },
          { transaction: t },
        );

        // Получение всех задач и обновление
        const tasks = await Instance.findAll();
        tasks.push(instance);
        const result = await this.dispatchService.updateTasks(tasks);
        if (!result || result.length === 0) {
          throw new Error('Не удалось добавить задачу, попробуйте снова');
        }

        // Проверка result на наличие ошибок
        const err_target = result.find((task) => task.error);
        if (err_target) {
          throw new Error(err_target.error);
        }

        const target = result.find(
          (task) => task.task_id === String(instance.id),
        );
        if (!target) {
          throw new Error('Failed to find target task');
        }

        instance.env_id = target.env_id;
        await instance.save({ transaction: t });
        return instance;
      })
      .catch((error) => {
        // Обработка ошибки
        console.error('Transaction failed:', error);
        throw error; // Логику обработки ошибок можно настроить по необходимости
      });
  }

  /**
   * Удаление задачи
   */
  public async removeTask(taskId: string): Promise<boolean> {
    const instance = await Instance.findByPk(taskId);

    if (!instance) {
      return false;
    }

    await instance.destroy();

    // Поиск и удаление соответствующей конфигурации
    const config = await Config.findOne({
      where: { instance_id: taskId },
    });
    if (config) {
      // Проверка использования плагина
      if (config.plugin_id) {
        const plugin = await Plugin.findOne({
          where: { id: config.plugin_id },
        });
        if (plugin) {
          await plugin.destroy();
        }
      }

      await config.destroy();
    }

    // Получение всех задач и обновление
    const tasks = await Instance.findAll();
    await this.dispatchService.updateTasks(tasks);

    return true;
  }
}
