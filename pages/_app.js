import '../styles/globals.css'
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "../src/components/ui/toaster"
import { QueryClient, QueryClientProvider } from 'react-query';


function MyApp({ Component, pageProps }) {

  const queryClient = new QueryClient();
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
