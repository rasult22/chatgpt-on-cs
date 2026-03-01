import React, { useEffect, useState } from 'react';
import {
  Button,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useWebSocketContext } from '../../hooks/useBroadcastContext';

const SystemCheck = () => {
  const [humanTaskMsg, setHumanTaskMsg] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cancelRef = React.useRef<any>();
  const { registerEventHandler } = useWebSocketContext();

  useEffect(() => {
    const unregister = registerEventHandler((message) => {
      if (message.event === 'chrome_download') {
        setIsModalOpen(true);
      } else if (message.event === 'human_task') {
        if (!message.data) {
          return;
        }

        window.electron.ipcRenderer.sendMessage(
          'notification',
          'Предупреждение',
          'Есть сообщения, требующие ручной обработки. Обратите внимание: после обработки снимите паузу.',
        );

        const data = message.data as {
          message: string;
          value: string;
          type: string;
        };

        if (data.type === 'strategy') {
          setHumanTaskMsg(data.message);
          onOpen();
        } else if (data.type === 'system') {
          setHumanTaskMsg(data.message);
          onOpen();
        }
      }
    });

    // Отмена регистрации обработчика событий при размонтировании компонента
    return () => unregister();
  }, [registerEventHandler]); // eslint-disable-line

  const confirmDownload = () => {
    window.electron.ipcRenderer.sendMessage(
      'open-url',
      'https://www.google.cn/chrome/',
    );
  };

  useEffect(() => {
    const version = window.electron.ipcRenderer.get('get-browser-version');
    if (!version) {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Установка браузера</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            У вас не установлен браузер Chrome. Пожалуйста, установите Chrome и перезапустите приложение.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmDownload}>
              Установить сейчас
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Ручная обработка сообщений
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack>
                <Text>Программа приостановлена</Text>
                <Text>{humanTaskMsg}</Text>
                <Text>
                  На платформе есть сообщения, требующие ручной обработки. После обработки снимите паузу.
                </Text>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ОК
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SystemCheck;
