import { AppRouter } from "./routes/appRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
