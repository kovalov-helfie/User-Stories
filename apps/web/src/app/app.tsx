import { AppKitProvider } from '../components/app-kit-provider';
import { ChakraProvider } from '@chakra-ui/react'

export function App() {
  return (
    <ChakraProvider>
      <AppKitProvider/>
    </ChakraProvider>
  );
}

export default App;
