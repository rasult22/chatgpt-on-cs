import axios from 'axios';
import { BrowserWindow } from 'electron';
import { setCron } from './system/cron';
import type BackendServiceManager from './system/backend';

const setupCron = (mainWindow: BrowserWindow, bsm: BackendServiceManager) => {
  const baseURL = (url: string) => {
    return `http://127.0.0.1:${bsm.getPort()}/${url}`;
  };

  // Выполняется каждые 5 секунд, уведомление процесса рендеринга об обновлении конфигурации
  setCron('*/5 * * * * *', () => {
    mainWindow.webContents.send('refresh-config');
  });

  // Проверка работоспособности бэкенд-сервиса каждые 5 секунд
  setCron('*/5 * * * * *', async () => {
    if (!bsm) {
      console.error('BackendServiceManager not found');
      return;
    }

    const {
      data: { data },
    } = await axios.get(baseURL(`api/v1/base/health`));
    mainWindow.webContents.send('check-health', data);
  });

  // Синхронизация состояния бэкенд-сервиса каждые 5 секунд
  setCron('*/20 * * * * *', async () => {
    if (!bsm) {
      console.error('BackendServiceManager not found');
      return;
    }

    // Для упрощения зависимостей здесь используется прямой запрос через axios
    try {
      await axios.post(baseURL('api/v1/base/sync'), {});
    } catch (error) {
      console.error('Error syncing backend service status:', error);
    }
  });
};

export default setupCron;
