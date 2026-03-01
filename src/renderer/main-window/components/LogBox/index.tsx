import React, { useEffect } from 'react';
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  TableContainer,
  Button,
  Box,
  VStack,
} from '@chakra-ui/react';
import { useWebSocketContext } from '../../hooks/useBroadcastContext';
import useGlobalStore from '../../../settings-window/stores/useGlobalStore';

const LogBox = () => {
  const { logs, clearLogs, addLog } = useGlobalStore();
  const { registerEventHandler } = useWebSocketContext();

  useEffect(() => {
    const unregister = registerEventHandler((message) => {
      if (message.event === 'log_show') {
        if (message.data) {
          const log = message.data as {
            time: string;
            content: string;
          };

          if (log) {
            addLog(log);
          }
        }
      }
    });

    // отмена регистрации обработчика событий при размонтировании компонента
    return () => unregister();
  }, [registerEventHandler]); // eslint-disable-line

  const clearLog = () => {
    clearLogs();
  };

  const openSelectedFolder = () => {
    window.electron.ipcRenderer.sendMessage('open-logger-folder');
  };

  return (
    <Box minHeight="150px">
      <VStack>
        {/* выравнивание по левому краю */}
        <HStack width="full" justifyContent="flex-start">
          <Heading as="h5" size="md" ml="2" mr="5">
            Журнал работы
          </Heading>
          <Button size="sm" onClick={clearLog}>
            Очистить все логи
          </Button>
          <Button size="sm" onClick={openSelectedFolder}>
            Открыть файл логов
          </Button>
        </HStack>

        <TableContainer overflowY="scroll" width="full" maxH={'40vh'}>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Время</Th>
                <Th>Содержание</Th>
              </Tr>
            </Thead>
            <Tbody bg="gray.100">
              {logs.map((log, index) => (
                <Tr key={index}>
                  <Td>{log.time}</Td>
                  <Td>{log.content}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
};

export default React.memo(LogBox);
