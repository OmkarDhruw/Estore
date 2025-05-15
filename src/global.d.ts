// This file contains global type declarations for external modules that don't have their own types

declare module 'react-query' {
  export { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
}

declare module 'react-hot-toast' {
  export { toast, Toaster } from 'react-hot-toast';
  export default toast;
} 