import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Text,
  VStack,
  Container,
  Input,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const AccountSettings = () => {
  const [activationCode, setActivationCode] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expiryDate, setExpiryDate] = useState('2024-12-31'); // можно настроить динамически по необходимости
  const [activationStatus, setActivationStatus] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    if (currentDate > expiry) {
      setIsExpired(true);
    }
  }, [expiryDate]);

  const handleActivation = () => {
    // Здесь добавляется логика активации
    if (activationCode && !isExpired) {
      setActivationStatus('Ошибка активации');
    } else if (isExpired) {
      setActivationStatus('Код активации истёк');
    } else {
      setActivationStatus('Введите действительный код активации');
    }
  };

  return (
    <ChakraProvider>
      <Container>
        <VStack spacing="4" align="start" mt="8">
          <Text>Введите код активации</Text>
          <Input
            placeholder="Код активации"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            isDisabled={isExpired}
          />
          {/* <Text>激活码到期时间: {expiryDate}</Text> */}
          <Button
            colorScheme="blue"
            onClick={handleActivation}
            isDisabled={isExpired}
          >
            Активировать
          </Button>
          {activationStatus && (
            <Alert
              status={activationStatus === 'Активация успешна' ? 'success' : 'error'}
            >
              <AlertIcon />
              {activationStatus}
            </Alert>
          )}
          {isExpired && (
            <Alert status="error">
              <AlertIcon />
              Код активации истёк. Свяжитесь со службой поддержки для получения нового кода.
            </Alert>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default AccountSettings;
