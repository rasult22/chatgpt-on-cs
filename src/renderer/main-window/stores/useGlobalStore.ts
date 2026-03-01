import { create } from 'zustand';

// Определение типа объекта лога
interface LogObj {
  time: string;
  content: string;
}

// Определение состояния и методов хранилища
interface GlobalStore {
  logs: LogObj[];
  addLog: (log: LogObj) => void;
  clearLogs: () => void;
}

// Создание хранилища
const useGlobalStore = create<GlobalStore>((set) => ({
  logs: [], // Начальный массив логов пуст

  // Метод добавления лога
  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log].slice(-50), // Массив логов содержит максимум 50 записей, при превышении удаляются самые старые
    })),

  // Метод очистки логов
  clearLogs: () =>
    set(() => ({
      logs: [],
    })),
}));

export default useGlobalStore;
