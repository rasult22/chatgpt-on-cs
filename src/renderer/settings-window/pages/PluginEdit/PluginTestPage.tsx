import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Divider,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { FiPlay } from 'react-icons/fi';
import { checkPluginAvailability } from '../../../common/services/platform/controller';
import { useSystemStore } from '../../stores/useSystemStore';
import {
  Message,
  RoleType,
  MessageType,
  LogBody,
} from '../../../common/services/platform/platform';
import {
  ContextKeys,
  MockCtx,
  MockMessages,
} from '../../../common/utils/constants';

const PluginTestPage = ({ code }: { code?: string }) => {
  const toast = useToast();
  const [consoleLogs, setConsoleLogs] = useState<LogBody[]>([]);
  const [hasRuning, setHasRuning] = useState(false);
  const [newMessage, setNewMessage] = useState<Message>({
    sender: '',
    content: '',
    role: 'SELF',
    type: 'TEXT',
  });
  const [selectedContextKey, setSelectedContextKey] = useState<string>(
    ContextKeys[0],
  );
  const [contextValue, setContextValue] = useState<string>('');
  const {
    context,
    setContext,
    clearContext,
    addMessage,
    messages,
    removeMessage,
  } = useSystemStore();

  const handleAddMessage = () => {
    addMessage(newMessage);
    setNewMessage({ sender: '', content: '', role: 'SELF', type: 'TEXT' });
  };

  const handleSetContext = () => {
    setContext(selectedContextKey, contextValue);
    setContextValue('');
  };

  const handleCheckPlugin = async () => {
    try {
      setHasRuning(true);
      const resp = await checkPluginAvailability({
        code: code || '',
        ctx: context,
        messages,
      });
      setConsoleLogs(resp.consoleOutput || []);
      if (resp.status && resp.message) {
        toast({
          title: 'Тест плагина пройден',
          position: 'top',
          description: resp.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        let error_msg = 'Неизвестная ошибка';
        if (resp.error) {
          error_msg = resp.error;
        } else if (!resp.message) {
          error_msg = 'Ответное сообщение пустое';
        }

        toast({
          title: 'Тест плагина не пройден',
          position: 'top',
          description: error_msg,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Не удалось проверить плагин',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setHasRuning(false);
    }
  };

  const handleSetDefault = () => {
    // MockCtx — это объект Map
    clearContext();

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of MockCtx) {
      setContext(key, value);
    }

    // Сначала очистить все сообщения
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      removeMessage(i);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const msg of MockMessages) {
      // @ts-ignore
      addMessage(msg);
    }
  };

  return (
    <VStack spacing="4" align="start" width="100%">
      <HStack>
        <Button
          leftIcon={<FiPlay />}
          onClick={handleCheckPlugin}
          colorScheme="green"
          size="sm"
          isLoading={hasRuning}
        >
          Тестировать плагин
        </Button>
        <Button leftIcon={<RepeatIcon />} onClick={handleSetDefault} size="sm">
          Установить по умолчанию
        </Button>
      </HStack>

      <Flex width="100%" justifyContent="space-between">
        <Box width="48%">
          <FormControl>
            <FormLabel>Тестовый контекст</FormLabel>
            <Select
              value={selectedContextKey}
              onChange={(e) => setSelectedContextKey(e.target.value)}
            >
              {ContextKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Значение контекста</FormLabel>
            <Input
              value={contextValue}
              onChange={(e) => setContextValue(e.target.value)}
            />
          </FormControl>
          <Button
            mt={4}
            onClick={handleSetContext}
            colorScheme="blue"
            size="sm"
          >
            Установить содержимое контекста
          </Button>
          <Divider my={4} />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Ключ контекста</Th>
                <Th>Значение контекста</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(context).map(([key, value], index) => (
                <Tr key={index}>
                  <Td>{key}</Td>
                  <Td>{value}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box width="48%">
          <FormControl>
            <FormLabel>Отправитель</FormLabel>
            <Input
              value={newMessage.sender}
              onChange={(e) =>
                setNewMessage({ ...newMessage, sender: e.target.value })
              }
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Содержимое сообщения</FormLabel>
            <Input
              value={newMessage.content}
              onChange={(e) =>
                setNewMessage({ ...newMessage, content: e.target.value })
              }
            />
          </FormControl>
          <HStack mt={4}>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                value={newMessage.role}
                onChange={(e) =>
                  setNewMessage({
                    ...newMessage,
                    role: e.target.value as RoleType,
                  })
                }
              >
                <option value="SELF">Своё сообщение</option>
                <option value="OTHER">Чужое сообщение</option>
                <option value="SYSTEM">Системное сообщение</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Тип сообщения</FormLabel>
              <Select
                value={newMessage.type}
                onChange={(e) =>
                  setNewMessage({
                    ...newMessage,
                    type: e.target.value as MessageType,
                  })
                }
              >
                <option value="TEXT">Текст</option>
                <option value="IMAGE">Изображение</option>
                <option value="VIDEO">Видео</option>
                <option value="FILE">Файл</option>
              </Select>
            </FormControl>
          </HStack>
          <Button
            mt={4}
            onClick={handleAddMessage}
            colorScheme="blue"
            size="sm"
          >
            Добавить сообщение
          </Button>
          <Divider my={4} />
          <Box>
            {messages.map((msg, index) => (
              <HStack
                key={index}
                justify="space-between"
                mb={2}
                bg={msg.role === 'SELF' ? 'blue.100' : 'gray.100'}
                p={2}
                borderRadius="md"
              >
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {msg.sender}
                  </Text>
                  <Text fontSize="sm">{msg.content}</Text>
                  <Text fontSize="xs" color="gray.500">
                    ({msg.role} - {msg.type})
                  </Text>
                </Box>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeMessage(index)}
                >
                  Удалить
                </Button>
              </HStack>
            ))}
          </Box>
        </Box>
      </Flex>

      <Divider />
      <Box width="100%">
        <HStack justify="space-between">
          <Text fontWeight="bold">Просмотр логов</Text>
          <Button
            onClick={() => setConsoleLogs([])}
            colorScheme="red"
            size="sm"
          >
            Очистить логи
          </Button>
        </HStack>
        {consoleLogs && consoleLogs.length > 0 && (
          <Box height="200px" overflowY="auto" mt={2}>
            {consoleLogs.map((log, index) => (
              <Text key={index}>
                {log.level} {log.time} {log.message}
              </Text>
            ))}
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default PluginTestPage;
