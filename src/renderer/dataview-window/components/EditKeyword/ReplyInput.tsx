import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Text,
  Icon,
  HStack,
  Box,
  Switch,
  Select,
  IconButton,
  Tooltip,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';
import { AddIcon, AttachmentIcon } from '@chakra-ui/icons';
import MyTextarea from '../../../common/components/MyTextarea';
import Markdown from '../../../common/components/Markdown';
import { App } from '../../../common/services/platform/platform';

type ReplyInputProps = {
  newReply: string;
  setNewReply: (value: string) => void;
  handleAddReply: () => void;
  handleInsertRandomChar: () => void;
  handleInsertFile: () => void;
  currentPlatform: App | undefined;
};

const ReplyInput = ({
  newReply,
  setNewReply,
  handleAddReply,
  handleInsertRandomChar,
  handleInsertFile,
  currentPlatform,
}: ReplyInputProps) => (
  <>
    <Flex mb="8px" mt="22px">
      <Text mr={2} fontSize={'large'} fontWeight={'bold'}>
        Содержимое ответа
      </Text>
      <Tooltip label="Если хотя бы одно из добавленных ключевых слов совпадёт, будет отправлен ответ. При наличии нескольких ответов один из них выбирается случайно.">
        <Box color={'gray.500'}>
          <Icon as={FiHelpCircle} w={6} h={6} />
        </Box>
      </Tooltip>
    </Flex>
    {currentPlatform && currentPlatform.desc && (
      <Box>
        <Markdown content={currentPlatform.desc} />
      </Box>
    )}
    <Tooltip label="На платформах типа Pinduoduo не допускается повторение одного и того же ответа; вставьте случайный символ">
      <Button onClick={handleInsertRandomChar} mt="4" mr={4} colorScheme="teal">
        Вставить случайный символ
      </Button>
    </Tooltip>
    <Tooltip label="На некоторых платформах, не поддерживающих отправку файлов или изображений, эта функция недоступна">
      <Button
        leftIcon={<AttachmentIcon />}
        mt="4"
        onClick={handleInsertFile}
        colorScheme="orange"
      >
        Вставить файл
      </Button>
    </Tooltip>
    <Stack direction="row" mt="4">
      <MyTextarea
        mb="4"
        maxLength={200}
        placeholder="Содержимое ответа"
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
      />
      <Button onClick={handleAddReply} colorScheme="green">
        <AddIcon />
      </Button>
    </Stack>
  </>
);

export default ReplyInput;
