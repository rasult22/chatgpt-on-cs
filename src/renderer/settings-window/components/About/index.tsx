import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Stack,
  useToast,
} from '@chakra-ui/react';
import PageContainer from '../../../common/components/PageContainer';
import Markdown from '../../../common/components/Markdown';
import { getVersionInfo } from '../../../common/services/system/controller';
import { trackPageView } from '../../../common/services/analytics';

const AboutPage: React.FC = () => {
  const toast = useToast();
  const currentVersion = window.electron.ipcRenderer.get('get-version');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updates, setUpdates] = useState<
    {
      version: string;
      url: string;
      description: string;
    }[]
  >([]);

  const checkUpdate = async () => {
    const cv = window.electron.ipcRenderer.get('get-version');
    const versionUpdates = await getVersionInfo(cv);
    if (versionUpdates.length > 0) {
      setUpdates(versionUpdates);
      setIsUpdateModalOpen(true);
    } else {
      toast({
        title: 'Установлена последняя версия',
        position: 'top',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    }
  };

  // При подтверждении обновления переход по ссылке загрузки последней версии
  const confirmUpdate = () => {
    const latestVersion = updates[0]; // Предполагается, что первый элемент всегда последняя версия
    if (latestVersion) {
      window.electron.ipcRenderer.sendMessage('open-url', latestVersion.url);
    }
  };

  useEffect(() => {
    trackPageView('AboutPage');
  }, []);

  return (
    <PageContainer>
      <VStack>
        <Markdown
          content={`
Этот проект — инструмент умной клиентской поддержки на основе больших языковых моделей. Поддерживается подключение к платформам Bilibili, Douyin Enterprise, Douyin, Doudian, Weibo Chat, Xiaohongshu Professional, Xiaohongshu, Zhihu и другим. Можно выбрать GPT3.5/GPT4.0. Обрабатывает текст, голос и изображения. Через плагины получает доступ к ОС и интернету. Поддерживает создание корпоративных ИИ-приложений на основе собственной базы знаний.

## Инструкция по использованию
Документация проекта: [Инструкция по использованию Ленивого клиентского сервиса](https://doc.lazaytools.top/)

## Демонстрационное видео
[Bilibili](https://www.bilibili.com/video/BV1qz421Q73S)

## Адрес проекта

* [GitHub](https://github.com/lrhh123/ChatGPT-On-CS)
* [Gitee](https://gitee.com/alsritter/ChatGPT-On-CS) (рекомендуется для пользователей из Китая)

## Контактная информация
Отсканируйте QR-код для добавления помощника WeChat, укажите «Ленивый клиентский сервис».

![](https://image.quicktoolset.top/img202406172039969.png)
      `}
        />
      </VStack>

      <br />

      <Box p={5}>
        <Stack spacing={3}>
          <Text fontWeight="bold">Информация о версии</Text>
          <Text>Ленивый клиентский сервис {currentVersion}</Text>

          {/* Проверить обновления */}
          <Button size="sm" onClick={checkUpdate}>
            Проверить обновления
          </Button>
        </Stack>
      </Box>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Обновление версии</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Текущая версия {currentVersion}. Обнаружены следующие обновления:</Text>
            <VStack spacing={4} mt="20px">
              {updates.map((update, index) => (
                <Box key={index}>
                  <Markdown content={update.description} />
                </Box>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmUpdate}>
              Обновить до последней версии
            </Button>
            <Button variant="ghost" onClick={() => setIsUpdateModalOpen(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default AboutPage;
