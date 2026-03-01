import React, { useRef, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  VStack,
  Button,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import { RepeatIcon } from '@chakra-ui/icons';
import Editor, { Monaco } from '@monaco-editor/react';
import {
  PluginExampleCode,
  PluginExtraLib,
} from '../../../common/utils/constants';
import { Plugin } from '../../../common/services/platform/platform';

type PluginEditorProps = {
  plugin?: Plugin;
  setPlugin: (plugin: Plugin) => void;
  handleSaveCode: (code?: string) => void;
};

// Дочерний компонент: страница редактирования плагина
const PluginEditor = ({
  plugin,
  setPlugin,
  handleSaveCode,
}: PluginEditorProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();
  const handleSaveCodeRef = useRef(handleSaveCode);

  useEffect(() => {
    handleSaveCodeRef.current = handleSaveCode;
  }, [handleSaveCode]);

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.languages.registerCompletionItemProvider('javascript', {
      // @ts-ignore
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'require',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'require()',
            documentation: 'Импорт модуля',
          },
          {
            label: 'console',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'console.log()',
            documentation: 'Вывод в лог',
          },
        ];
        return { suggestions };
      },
    });
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      PluginExtraLib,
      'ts:filename/types.d.ts',
    );

    monaco.editor.addEditorAction({
      id: 'save-code',
      label: 'Сохранить код',
      // eslint-disable-next-line no-bitwise
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        handleSaveCodeRef.current();
      },
    });
  };

  return (
    <Box position="relative" width="100%">
      {plugin && plugin.source !== 'custom' && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          justifyContent="center"
          alignItems="center"
          zIndex="1"
        >
          <Text color="white" fontSize="lg">
            Системный плагин нельзя редактировать
          </Text>
        </Flex>
      )}

      <VStack spacing="4" align="start" width="100%">
        <HStack>
          <Button
            leftIcon={<FiSave />}
            onClick={() => handleSaveCode()}
            colorScheme="teal"
            size="sm"
          >
            Сохранить код
          </Button>
          <Button leftIcon={<RepeatIcon />} onClick={onOpen} size="sm">
            Сбросить код
          </Button>
        </HStack>
        <Box width="100%" height="400px">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={plugin?.code || PluginExampleCode}
            onChange={(value) => {
              setPlugin({ ...plugin, code: value || '' });
            }}
            beforeMount={handleEditorWillMount}
            theme="vs-dark"
          />
        </Box>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Сбросить код
              </AlertDialogHeader>
              <AlertDialogBody>
                Вы уверены, что хотите сбросить код? Текущий код будет удалён.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Отмена
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setPlugin({ ...plugin, code: PluginExampleCode });
                    handleSaveCode(PluginExampleCode);
                    onClose();
                  }}
                  ml={3}
                >
                  Сбросить
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
};

export default PluginEditor;
