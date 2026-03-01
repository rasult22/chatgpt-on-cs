import React, { ChangeEvent } from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  Input,
  Highlight,
  InputGroup,
  InputRightElement,
  Button,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { LLMConfig } from '../../../common/services/platform/platform';
import { ModelList, LLMTypeList } from '../../../common/utils/constants';

interface ThirdPartyInterfaceProps {
  config: LLMConfig;
  handleUpdateConfig: (newConfig: Partial<LLMConfig>) => void;
  handleBaseURLChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCheckHealth: () => void;
  reply: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThirdPartyInterface: React.FC<ThirdPartyInterfaceProps> = ({
  config,
  handleUpdateConfig,
  handleBaseURLChange,
  handleCheckHealth,
  reply,
  show,
  setShow,
}) => (
  <>
    <FormControl>
      <FormLabel htmlFor="llmType">Выберите тип LLM</FormLabel>
      <Select
        id="llmType"
        placeholder="Выберите тип LLM"
        value={config.llmType}
        onChange={(e) => handleUpdateConfig({ llmType: e.target.value })}
      >
        {LLMTypeList.map((type) => (
          <option key={type.key} value={type.key}>
            {type.name}
          </option>
        ))}
      </Select>
    </FormControl>

    <FormControl>
      <FormLabel htmlFor="model">Выберите или введите модель</FormLabel>
      <InputGroup>
        <Input
          id="model"
          placeholder="Выберите или введите модель"
          value={config.model}
          onChange={(e) => handleUpdateConfig({ model: e.target.value })}
          list="models"
        />
        <datalist id="models">
          {ModelList.map((model) => (
            <option key={model.key} value={model.key}>
              {model.name}
            </option>
          ))}
        </datalist>
      </InputGroup>
    </FormControl>

    <FormControl>
      <FormLabel htmlFor="gptAddress" mt="8px">
        <Highlight query="/v1" styles={{ px: '1', py: '1', bg: 'orange.100' }}>
          Настройка адреса API (в конце необходимо добавить /v1)
        </Highlight>
        <Button
          size="sm"
          colorScheme="blue"
          ml="4"
          loadingText="Проверка..."
          onClick={handleCheckHealth}
        >
          Проверить подключение
        </Button>
      </FormLabel>
      <InputGroup size="sm">
        <Input
          id="gptAddress"
          value={config.baseUrl}
          placeholder="Введите адрес сайта"
          onChange={handleBaseURLChange}
        />
      </InputGroup>
    </FormControl>

    <FormControl>
      <FormLabel htmlFor="apiKey">API Key</FormLabel>
      <InputGroup size="md">
        <Input
          id="apiKey"
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          placeholder="Введите пароль"
          value={config.key}
          onChange={(e) => handleUpdateConfig({ key: e.target.value })}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    {reply && (
      <>
        <Text>Содержимое ответа</Text>
        <Text>{reply}</Text>
      </>
    )}
  </>
);

export default ThirdPartyInterface;
