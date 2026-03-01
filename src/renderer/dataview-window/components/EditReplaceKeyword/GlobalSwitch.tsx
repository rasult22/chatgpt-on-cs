import React from 'react';
import { Text, HStack, Switch, Tooltip, Flex } from '@chakra-ui/react';

type GlobalSwitchProps = {
  isGlobal: boolean;
  setIsGlobal: (isGlobal: boolean) => void;
};

const GlobalSwitch = ({ isGlobal, setIsGlobal }: GlobalSwitchProps) => (
  <Flex mt={3} alignItems="center">
    <Tooltip label="Будет ли это ключевое слово действовать для всех платформ? В противном случае выберите платформу">
      <HStack spacing={4} width="100%">
        <Text fontSize="large">Включить глобальное ключевое слово</Text>
        <Switch
          isChecked={isGlobal}
          onChange={() => setIsGlobal(!isGlobal)}
          size="lg"
        />
      </HStack>
    </Tooltip>
  </Flex>
);

export default GlobalSwitch;
