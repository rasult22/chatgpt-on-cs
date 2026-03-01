import React, { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  messages: any[];
};

const MessageModal = ({ isOpen, onClose, messages }: MessageModalProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; // 每一页显示的条数

  const pageCount = useMemo(
    () => Math.ceil(messages.length / itemsPerPage),
    [messages],
  );

  const currentMessages = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;

    console.log('start', start);
    console.log('end', end);
    return messages.slice(start, end);
  }, [currentPage, messages]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCurrentPage(0);
        onClose();
      }}
      size={'3xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Сообщения текущего диалога</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="striped" colorScheme="gray" size="sm">
            <Thead>
              <Tr>
                <Th>Роль</Th>
                <Th>Содержимое</Th>
                <Th>Отправитель</Th>
                <Th>Тип сообщения</Th>
                <Th>Время</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentMessages.map((message) => (
                <Tr key={message.id}>
                  <Td>{message.role}</Td>
                  <Td>
                    <Tooltip
                      label={message.content}
                      aria-label="Content tooltip"
                    >
                      {message.content.length > 20
                        ? `${message.content.slice(0, 20)}...`
                        : message.content}
                    </Tooltip>
                  </Td>
                  <Td>{message.sender}</Td>
                  <Td>{message.type}</Td>
                  <Td>{new Date(message.created_at).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box display="flex" justifyContent="center" mt={4}>
            <ReactPaginate
              previousLabel={'< Назад'}
              nextLabel={'Далее >'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={1}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              previousClassName={'page-item'}
              nextClassName={'page-item'}
              breakClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousLinkClassName={'page-link'}
              nextLinkClassName={'page-link'}
              breakLinkClassName={'page-link'}
              activeLinkClassName={'active-link'}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setCurrentPage(0);
              onClose();
            }}
          >
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MessageModal;
