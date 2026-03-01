import axios from 'axios';

export const isVersionGreater = (
  onlineVersion: string,
  currentVersion: string,
) => {
  // Обновление регулярного выражения для лучшего разделения чисел и суффиксов
  const versionRegex = /(\d+\.\d+\.\d+)(-?[^.]*)(\.\d+)?/;
  const [, onlineMain, onlinePre, onlinePreNum] =
    onlineVersion.match(versionRegex) || [];
  const [, currentMain, currentPre, currentPreNum] =
    currentVersion.match(versionRegex) || [];

  // Сравнение основного номера версии
  const onlineParts = onlineMain.split('.').map(Number);
  const currentParts = currentMain.split('.').map(Number);

  for (let i = 0; i < Math.max(onlineParts.length, currentParts.length); i++) {
    const onlinePart = onlineParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    if (onlinePart > currentPart) {
      return true;
    }
    if (onlinePart < currentPart) {
      return false;
    }
  }

  // Если основные версии совпадают, сравниваем суффиксы
  if (onlinePre || currentPre) {
    if (!onlinePre && currentPre) return true; // online без суффикса, current с суффиксом — online новее
    if (onlinePre && !currentPre) return false; // online с суффиксом, current без суффикса — online старее
    if (onlinePre !== currentPre) {
      return onlinePre > currentPre; // Прямое сравнение суффиксов как строк
    }
    // Если суффиксы одинаковы, сравниваем числовые суффиксы
    const onlinePreNumValue = onlinePreNum
      ? parseInt(onlinePreNum.substring(1), 10)
      : 0;
    const currentPreNumValue = currentPreNum
      ? parseInt(currentPreNum.substring(1), 10)
      : 0;
    return onlinePreNumValue > currentPreNumValue;
  }

  return false; // Если основная версия и суффикс полностью совпадают, возвращаем false
};

export const getVersionInfo = async (currentVersion: string) => {
  let updates: { version: string; url: string; description: string }[] = [];
  try {
    const response = await axios.get<
      Array<{ version: string; url: string; description: string }>
    >('https://update.wizgadg.top/check-update/chatgpt-on-cs');

    const { data } = response;
    // Фильтрация версий, более новых, чем текущая
    updates = data.filter((versionInfo) =>
      isVersionGreater(versionInfo.version, currentVersion),
    );
  } catch (error) {
    console.error(error);
  }

  return updates;
};
