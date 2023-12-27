import '../styles/globals.css'
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>

  )
}

export default MyApp
