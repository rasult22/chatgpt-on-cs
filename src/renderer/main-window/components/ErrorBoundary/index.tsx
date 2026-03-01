import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Link,
  Box,
} from '@chakra-ui/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Caught an error:', error, errorInfo);
  }

  componentWillUnmount() {
    window.removeEventListener(
      'unhandledrejection',
      this.handlePromiseRejection,
    );
  }

  handlePromiseRejection = (event: PromiseRejectionEvent) => {
    this.setState({ hasError: true, error: event.reason });
  };

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="gray.200"
          zIndex="modal"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          padding="40px"
        >
          <Alert
            status="error"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
            height="auto"
            borderRadius="md"
            boxShadow="lg"
            backgroundColor="white"
          >
            <AlertIcon boxSize="50px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="xl">
              Извините, в приложении произошла ошибка.
            </AlertTitle>
            <AlertDescription maxWidth="sm" mb={4}>
              {error?.toString() || 'Неизвестная ошибка. Попробуйте обновить страницу или повторите позже.'}
            </AlertDescription>
            <Button
              colorScheme="red"
              variant="solid"
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </Button>
            <AlertDescription maxWidth="sm" mt={4}>
              Если проблема сохраняется, свяжитесь с нами для получения помощи:
            </AlertDescription>
            <Link
              href="mailto:author@example.com"
              isExternal
              mt={2}
              color="teal.500"
            >
              author@example.com
            </Link>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
