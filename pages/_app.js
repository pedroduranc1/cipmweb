import '../styles/globals.css'
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "../src/components/ui/toaster"


function MyApp({ Component, pageProps }) {
  return (
    <div>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </div>

  )
}

export default MyApp
