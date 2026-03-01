import React from 'react';
import {
  Button,
  Stack,
  Text,
  Icon,
  Box,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';
import { AddIcon } from '@chakra-ui/icons';
import MyTextarea from '../../../common/components/MyTextarea';

type ReplyInputProps = {
  newReply: string;
  setNewReply: (value: string) => void;
  handleAddReply: () => void;
  handleInsertRandomChar: () => void;
};

const ReplyInput = ({
  newReply,
  setNewReply,
  handleAddReply,
  handleInsertRandomChar,
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
    <Tooltip label="На платформах типа Pinduoduo не допускается повторение одного и того же ответа; вставьте случайный символ, чтобы обойти это ограничение">
      <Button onClick={handleInsertRandomChar} mt="4" mr={4} colorScheme="teal">
        Вставить случайный символ
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
