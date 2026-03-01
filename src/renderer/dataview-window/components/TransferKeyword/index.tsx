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
import EditKeyword from '../EditTransferKeyword';
import {
  getTransferList,
  deleteTransferKeyword,
  updateTransferExcel,
  exportTransferExcel,
} from '../../../common/services/platform/controller';
import { TransferKeyword as TransferKeywordType } from '../../../common/services/platform/platform';

const TransferKeyword = () => {
  const [keywords, setKeywords] = useState<TransferKeywordType[]>([]);
  const [editKeyword, setEditKeyword] = useState<TransferKeywordType | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [updated, setUpdated] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['transferList'],
    () => {
      return getTransferList({
        page: 1,
        pageSize: 100,
        appId: '',
      });
    },
    {
      retry: () => {
        return true;
      },
      retryDelay: () => {
        return 1000;
      },
    },
  );

  useEffect(() => {
    if (data) {
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
      console.log(selectedPath);
      setUpdated(true);
      try {
        await updateTransferExcel({ path: selectedPath[0] });
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
        let message = 'Ошибка импорта';
        if (e instanceof Error) {
          message = e.message;
        } else if (typeof e === 'string') {
          message = e;
        } else {
          message = JSON.stringify(e);
        }

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
      await exportTransferExcel();
      toast({
        title: 'Экспорт успешен',
        description: 'Экспорт успешен',
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      let message = 'Ошибка экспорта';
      if (e instanceof Error) {
        message = e.message;
      } else if (typeof e === 'string') {
        message = e;
      } else {
        message = JSON.stringify(e);
      }

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

  const handleDoubleClick = (keyword: TransferKeywordType) => {
    setEditKeyword(keyword);
    onOpen();
  };

  const handleEdit = () => {
    refetch();
    onClose();
  };

  const handleDelete = async (id: number) => {
    await deleteTransferKeyword(id);
    refetch();
  };

  const handleAddKeyword = () => {
    const newKeyword: TransferKeywordType = {
      keyword: '',
      has_regular: false,
      fuzzy: true,
    };
    setKeywords([...keywords, newKeyword]);
    setEditKeyword(newKeyword);
    onOpen();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Alert status="info" mr={'20px'}>
          Совпадение по вводу пользователя: когда сообщение пользователя содержит ключевое слово, диалог автоматически переводится на живого оператора
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

export default TransferKeyword;
