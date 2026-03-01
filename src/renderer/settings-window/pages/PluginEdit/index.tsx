import React, { useState, useRef } from 'react';
import {
  VStack,
  Button,
  useToast,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FiChevronLeft,
  // FiShare2,
  FiTrash2,
  FiPlusCircle,
} from 'react-icons/fi';
import { PluginExampleCode } from '../../../common/utils/constants';
import {
  addCustomPlugin,
  updateCustomPlugin,
  deleteCustomPlugin,
} from '../../../common/services/platform/controller';
import { Plugin } from '../../../common/services/platform/platform';
import PluginTestPage from './PluginTestPage';
import PluginBasicInfo from './PluginBasicInfo';
import PluginEditorCom from './PluginEditor';
import useGlobalStore from '../../stores/useGlobalStore';

const PluginEdit = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();
  const navigate = useNavigate();
  const { currentPlugin } = useGlobalStore();

  const [plugin, setPlugin] = useState<Plugin>(
    currentPlugin || {
      title: 'Новый плагин',
      description: 'Это пользовательский плагин',
      code: PluginExampleCode,
      icon: '😀',
      tags: [],
      type: 'plugin',
      source: 'custom',
    },
  );

  const handleAddNewPlugin = async () => {
    try {
      await addCustomPlugin({
        ...plugin,
        code: plugin.code || PluginExampleCode,
      });
      toast({
        title: 'Плагин добавлен успешно',
        position: 'top',
        description: 'Плагин добавлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errormsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      toast({
        title: '新增插件失败',
        position: 'top',
        description: errormsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeletePlugin = async () => {
    if (!plugin || !plugin.id) return;
    try {
      await deleteCustomPlugin(plugin.id);
      toast({
        title: '删除插件成功',
        position: 'top',
        description: '插件已删除',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errormsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      toast({
        title: '删除插件失败',
        position: 'top',
        description: errormsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateConfig = async (newConfig: Partial<Plugin>) => {
    if (!plugin) return;
    const updatedConfig = { ...plugin, ...newConfig };
    setPlugin(updatedConfig);
    try {
      await updateCustomPlugin(updatedConfig);
    } catch (error) {
      const errormsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      toast({
        title: '更新插件失败',
        position: 'top',
        description: errormsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSaveCode = async (inCode?: string) => {
    if (!plugin) return;
    try {
      await updateCustomPlugin({
        ...plugin,
        code: inCode || plugin.code || PluginExampleCode,
      });
      toast({
        title: '代码已保存',
        position: 'top',
        description: '插件已更新',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errormsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      toast({
        title: '更新插件失败',
        position: 'top',
        description: errormsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack align="start" spacing="4" minHeight="100vh" position="relative">
      <Box position="fixed" top="10px" right="10px" zIndex={10}>
        <Button
          leftIcon={<FiChevronLeft />}
          colorScheme="teal"
          onClick={() => navigate('/')}
        >
          返回列表
        </Button>
      </Box>
      <Tabs width="70vw" flex="1">
        <TabList>
          <Tab>插件基础信息</Tab>
          <Tab>插件编辑</Tab>
          <Tab>测试插件</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PluginBasicInfo
              plugin={plugin}
              handleUpdateConfig={handleUpdateConfig}
            />
          </TabPanel>
          <TabPanel>
            <PluginEditorCom
              plugin={plugin}
              setPlugin={setPlugin}
              handleSaveCode={handleSaveCode}
            />
          </TabPanel>
          <TabPanel>
            <PluginTestPage code={plugin.code} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box h={'30px'} />

      {plugin.source === 'custom' ? (
        <HStack
          spacing="4"
          position="fixed"
          bottom="0"
          width="100%"
          bg="white"
          p="4"
          boxShadow="md"
          zIndex="2"
        >
          {
            //   <Button
            //   leftIcon={<FiShare2 />}
            //   colorScheme="purple"
            //   onClick={() => {
            //     /* 发布插件到社区逻辑 */
            //   }}
            // >
            //   发布社区
            // </Button>
          }
          {currentPlugin && currentPlugin.id ? (
            <Button leftIcon={<FiTrash2 />} colorScheme="red" onClick={onOpen}>
              删除
            </Button>
          ) : (
            <Button
              leftIcon={<FiPlusCircle />}
              colorScheme="blue"
              onClick={handleAddNewPlugin}
            >
              新增
            </Button>
          )}
        </HStack>
      ) : null}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              删除插件
            </AlertDialogHeader>
            <AlertDialogBody>
              你确定要删除插件吗？这个操作不可逆。
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                取消
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await handleDeletePlugin();
                  onClose();
                  navigate('/');
                }}
                ml={3}
              >
                删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default PluginEdit;
