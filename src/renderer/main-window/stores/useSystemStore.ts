import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Message } from '../../common/services/platform/platform';

const electronStore = {
  getItem: (key: string) => {
    const value = window.electron.store.get(key);
    try {
      return JSON.parse(value); // Убедиться, что строка корректно разобрана как объект
    } catch (error) {
      return null; // При ошибке разбора возвращаем null или разумное значение по умолчанию
    }
  },
  setItem: (key: string, value: any) => {
    window.electron.store.set(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    window.electron.store.remove(key);
  },
};

// Define message and driver state types
type MessageState = {
  context: Record<string, string>;
  messages: Message[];
  setContext: (key: string, value: string) => void;
  addMessage: (message: Message) => void;
  removeMessage: (index: number) => void;
};

type State = MessageState;

// Create Zustand store
export const useSystemStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        context: {},
        setContext: (key, value) =>
          set((state) => {
            state.context[key] = value;
          }),
        messages: [],
        addMessage: (message) =>
          set((state) => {
            state.messages.push(message);
          }),
        removeMessage: (index) =>
          set((state) => {
            state.messages.splice(index, 1);
          }),
      })),
      {
        name: 'globalStore',
        storage: createJSONStorage(() => electronStore),
        partialize: (state) => ({
          context: state.context,
          messages: state.messages,
        }),
      },
    ),
  ),
);
