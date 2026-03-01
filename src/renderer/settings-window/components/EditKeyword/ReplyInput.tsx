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
    <Tooltip label="在拼多多平台等平台，是不允许每次重复一个回答的，所以可以插入一个随机符，以规避这个问题">
      <Button onClick={handleInsertRandomChar} mt="4" mr={4} colorScheme="teal">
        插入随机符
      </Button>
    </Tooltip>
    <Stack direction="row" mt="4">
      <MyTextarea
        mb="4"
        maxLength={200}
        placeholder="回复内容"
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
