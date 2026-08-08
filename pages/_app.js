import '../styles/globals.css'
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "../src/components/ui/toaster"
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  )
}

export default MyApp
