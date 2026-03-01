import React from 'react';
import {
  ChakraProvider,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReplyKeyword from './components/ReplyKeyword';
import SessionHistory from './components/SessionHistory';
import ReplaceKeyword from './components/ReplaceKeyword';
import TransferKeyword from './components/TransferKeyword';
import theme from '../common/styles/theme';
import '../common/App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 10,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Flex direction="row" height="99vh">
          <Tabs variant="enclosed" orientation="vertical" flex="1">
            <TabList
              p={4}
              width="200px"
              bg="gray.100"
              borderRight="1px solid"
              borderColor="gray.200"
            >
              <Tab
                _selected={{ bg: 'gray.200' }}
                _hover={{ bg: 'gray.300' }}
                textAlign="left"
              >
                Редактирование ключевых слов
              </Tab>

              <Tab
                _selected={{ bg: 'gray.200' }}
                _hover={{ bg: 'gray.300' }}
                textAlign="left"
              >
                Замена ключевых слов
              </Tab>
              <Tab
                _selected={{ bg: 'gray.200' }}
                _hover={{ bg: 'gray.300' }}
                textAlign="left"
              >
                Ключевые слова для перевода на оператора
              </Tab>
              <Tab
                _selected={{ bg: 'gray.200' }}
                _hover={{ bg: 'gray.300' }}
                textAlign="left"
              >
                История чатов
              </Tab>
            </TabList>
            <TabPanels flex="1" overflowY="auto" p={4}>
              <TabPanel>
                <Heading as="h3" size="md" mb={4}>
                  Совпадение ключевых слов
                </Heading>
                <ReplyKeyword />
              </TabPanel>

              <TabPanel>
                <Heading as="h3" size="md" mb={4}>
                  Замена ключевых слов
                </Heading>
                <ReplaceKeyword />
              </TabPanel>
              <TabPanel>
                <Heading as="h3" size="md" mb={4}>
                  Ключевые слова для перевода на оператора
                </Heading>
                <TransferKeyword />
              </TabPanel>
              <TabPanel>
                <Heading as="h3" size="md" mb={4}>
                  История чатов
                </Heading>
                <SessionHistory />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default React.memo(App);
