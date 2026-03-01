import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  TableContainer,
  useDisclosure,
  useToast,
  Alert,
  Button,
  IconButton,
  Box,
  Skeleton,
  Stack,
  Tooltip,
  HStack,
  Grid,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, EditIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import EditKeyword from '../EditReplaceKeyword';
import {
  getReplaceList,
  deleteReplaceKeyword,
  updateReplaceExcel,
  exportReplaceExcel,
} from '../../../common/services/platform/controller';
import { ReplaceKeyword as ReplaceKeywordType } from '../../../common/services/platform/platform';

const ReplaceKeyword = () => {
  const [keywords, setKeywords] = useState<ReplaceKeywordType[]>([]);
  const [editKeyword, setEditKeyword] = useState<ReplaceKeywordType | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [updated, setUpdated] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['replaceList'],
    () => {
      return getReplaceList({
        page: 1,
        pageSize: 100,
        appId: '',
      });
    },
    {
      retry: true,
      retryDelay: 1000,
    },
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setKeywords(data?.data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  const handleInsertFile = () => {
    window.electron.ipcRenderer.sendMessage('select-file', {
      filters: [{ name: 'Шаблон Excel', extensions: ['xls', 'xlsx'] }],
    });
    window.electron.ipcRenderer.once('selected-file', async (path) => {
      const selectedPath = path as string[];
      if (!selectedPath.length || !selectedPath[0]) return;
      setUpdated(true);
      try {
        await updateReplaceExcel({ path: selectedPath[0] });
        refetch();
        toast({
          title: 'Импорт успешен',
          description: 'Импорт успешен',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (e) {
        const message =
          // eslint-disable-next-line no-nested-ternary
          e instanceof Error
            ? e.message
            : typeof e === 'string'
              ? e
              : JSON.stringify(e);
        toast({
          title: 'Ошибка импорта',
          description: message,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setUpdated(false);
      }
    });
  };

  const handleExportReplyExcel = async () => {
    try {
      setUpdated(true);
      await exportReplaceExcel();
      toast({
        title: 'Экспорт успешен',
        description: 'Экспорт успешен',
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      const message =
        // eslint-disable-next-line no-nested-ternary
        e instanceof Error
          ? e.message
          : typeof e === 'string'
            ? e
            : JSON.stringify(e);
      toast({
        title: 'Ошибка экспорта',
        description: message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdated(false);
    }
  };

  const handleDoubleClick = (keyword: ReplaceKeywordType) => {
    setEditKeyword(keyword);
    onOpen();
  };

  const handleEdit = () => {
    refetch();
    onClose();
  };

  const handleDelete = async (id: number) => {
    await deleteReplaceKeyword(id);
    refetch();
  };

  const handleAddKeyword = () => {
    const newKeyword: ReplaceKeywordType = {
      keyword: '',
      replace: '',
      fuzzy: true,
      has_regular: false,
    };
    setKeywords([...keywords, newKeyword]);
    setEditKeyword(newKeyword);
    onOpen();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Alert status=”info” mr={'20px'}>
          Например: ключевое слово — «привет», замена — «здравствуйте». Когда ответ содержит «привет, я ChatGPT», он будет заменён на «здравствуйте, я ChatGPT».
        </Alert>
        <Flex alignItems="center">
          <HStack>
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              color="white"
              bgGradient="linear(to-r, teal.500, green.500)"
              _hover={{
                bgGradient: 'linear(to-r, teal.300, green.300)',
              }}
              variant="solid"
              onClick={handleAddKeyword}
              isLoading={updated}
            >
              Добавить ключевое слово
            </Button>
            <Tooltip label="Импортировать и перезаписать ключевые слова">
              <Button
                size="sm"
                variant="solid"
                colorScheme="linkedin"
                onClick={handleInsertFile}
                isLoading={updated}
              >
                Импорт с перезаписью
              </Button>
            </Tooltip>
            <Tooltip label="Экспорт ключевых слов (скачать шаблон)">
              <Button
                size="sm"
                variant="solid"
                onClick={handleExportReplyExcel}
                isLoading={updated}
              >
                Экспорт
              </Button>
            </Tooltip>
          </HStack>
        </Flex>
      </Box>
      <TableContainer maxH={'70vh'} overflowY="scroll">
        <Table variant="striped" size="sm" className="table-tiny">
          <Thead>
            <Tr>
              <Th>Платформа</Th>
              <Th>Ключевое слово</Th>
              <Th>Содержимое для замены</Th>
              <Th>Нечёткое совпадение</Th>
              <Th>Регулярное выражение</Th>
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {keywords.map((keyword) => (
              <Tr
                sx={{ height: '30px' }}
                key={keyword.id}
                onDoubleClick={() => handleDoubleClick(keyword)}
              >
                <Td>{keyword.app_name}</Td>
                <Td
                  maxW="80px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {keyword.keyword}
                </Td>
                <Td
                  maxW="150px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {keyword.replace}
                </Td>
                <Td>{keyword.fuzzy ? 'Да' : 'Нет'}</Td>
                <Td>{keyword.has_regular ? 'Да' : 'Нет'}</Td>
                <Td>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    <Tooltip label="Удалить">
                      <IconButton
                        size="xs"
                        fontSize="13px"
                        colorScheme="red"
                        aria-label="Delete keyword"
                        icon={<DeleteIcon />}
                        onClick={() => keyword.id && handleDelete(keyword.id)}
                      />
                    </Tooltip>

                    <Tooltip label="Редактировать">
                      <IconButton
                        size="xs"
                        fontSize="13px"
                        colorScheme="blue"
                        aria-label="Edit keyword"
                        icon={<EditIcon />}
                        onClick={() => {
                          setEditKeyword(keyword);
                          onOpen();
                        }}
                      />
                    </Tooltip>
                  </Grid>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <EditKeyword
        isOpen={isOpen}
        onClose={onClose}
        editKeyword={editKeyword}
        handleEdit={handleEdit}
      />
    </Box>
  );
};

export default ReplaceKeyword;
