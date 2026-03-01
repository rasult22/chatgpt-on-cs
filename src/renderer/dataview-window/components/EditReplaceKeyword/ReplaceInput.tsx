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
import Markdown from '../../../common/components/Markdown';
import { App } from '../../../common/services/platform/platform';

type ReplaceInputProps = {
  newReplace: string;
  setNewReplace: (value: string) => void;
  handleAddReplace: () => void;
  handleInsertRandomChar: () => void;
  currentPlatform: App | undefined;
};

const ReplaceInput = ({
  newReplace,
  setNewReplace,
  handleAddReplace,
  handleInsertRandomChar,
  currentPlatform,
}: ReplaceInputProps) => (
  <>
    <Flex mb="8px" mt="22px">
      <Text mr={2} fontSize={'large'} fontWeight={'bold'}>
        Замена
      </Text>
      <Tooltip label="Если хотя бы одно из добавленных ключевых слов совпадёт, будет выполнена замена. При наличии нескольких вариантов замены один из них выбирается случайно.">
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
    <Stack direction="row" mt="4">
      <MyTextarea
        mb="4"
        maxLength={200}
        placeholder="Содержимое для замены"
        value={newReplace}
        onChange={(e) => setNewReplace(e.target.value)}
      />
      <Button onClick={handleAddReplace} colorScheme="green">
        <AddIcon />
      </Button>
    </Stack>
  </>
);

export default ReplaceInput;
