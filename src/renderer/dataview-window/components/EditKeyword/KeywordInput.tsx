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
import { AddIcon } from '@chakra-ui/icons';

type KeywordInputProps = {
  newKeyword: string;
  setNewKeyword: (value: string) => void;
  handleAddKeyword: () => void;
  startKeyword: string;
  setStartKeyword: (value: string) => void;
  endKeyword: string;
  setEndKeyword: (value: string) => void;
  handleAddFuzzyKeyword: () => void;
};

const KeywordInput = ({
  newKeyword,
  setNewKeyword,
  handleAddKeyword,
  startKeyword,
  setStartKeyword,
  endKeyword,
  setEndKeyword,
  handleAddFuzzyKeyword,
}: KeywordInputProps) => (
  <>
    <Flex mb="8px" mt="12px">
      <Text mr={2} fontSize={'large'} fontWeight={'bold'}>
        Настройка ключевых слов
      </Text>
      <Tooltip label="Настройте ключевые слова для точного ответа; вопросы с совпадением ключевых слов не отправляются в GPT">
        <Box color={'gray.500'}>
          <Icon as={FiHelpCircle} w={6} h={6} />
        </Box>
      </Tooltip>
    </Flex>
    <Stack direction="row" mb="4">
      <Input
        placeholder="Новое ключевое слово"
        value={newKeyword}
        onChange={(e) => setNewKeyword(e.target.value)}
      />
      <Tooltip label="Добавить ключевое слово; используйте * для нечёткого совпадения, \* для ввода символа *">
        <Button onClick={handleAddKeyword} colorScheme="green">
          <AddIcon />
        </Button>
      </Tooltip>
    </Stack>
    <Stack direction="row" mb="4">
      <Input
        placeholder="Начальное ключевое слово"
        value={startKeyword}
        onChange={(e) => setStartKeyword(e.target.value)}
      />
      <Input
        placeholder="Конечное ключевое слово"
        value={endKeyword}
        onChange={(e) => setEndKeyword(e.target.value)}
      />
      <Tooltip label="Добавить диапазонное ключевое слово; при совпадении начального и конечного ключевых слов считается успешным">
        <Button onClick={handleAddFuzzyKeyword} colorScheme="green">
          <AddIcon />
        </Button>
      </Tooltip>
    </Stack>
  </>
);

export default KeywordInput;
