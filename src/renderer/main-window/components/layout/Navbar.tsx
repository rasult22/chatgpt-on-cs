import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import {
  SettingsIcon,
  ChatIcon,
  CalendarIcon,
} from '@chakra-ui/icons';

const Navbar = () => {
  const handleOpenSettings = () => {
    window.electron.ipcRenderer.sendMessage('open-settings-window', {});
  };

  const handleOpenDataview = () => {
    window.electron.ipcRenderer.sendMessage('open-dataview-window', {});
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      position="fixed"
      width="100%"
      top="0"
      bg={'white'}
      zIndex="1000"
      height="60px"
    >
      <Text as="h1" fontSize="2em" letterSpacing="tighter" className="font-zh">
        Ленивый клиентский сервис
      </Text>

      <Box display={{ md: 'flex' }} gap="1rem">
        <Button
          size="sm"
          mr={2}
          leftIcon={<CalendarIcon />}
          onClick={handleOpenDataview}
        >
          Записи
        </Button>
        <Button
          size="sm"
          mr={2}
          leftIcon={<ChatIcon />}
          onClick={handleOpenDataview}
        >
          Ключевые слова
        </Button>
        <Button
          size="sm"
          leftIcon={<SettingsIcon />}
          onClick={handleOpenSettings}
        >
          Настройки
        </Button>
      </Box>
    </Flex>
  );
};

export default React.memo(Navbar);
