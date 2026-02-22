import { AuthProvider } from "./app/providers/AuthProvider";
import AppRouter from "./app/router";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer
        position="top-right"
        toastStyle={{ width: "300px", marginTop: "10px", marginRight: "10px" }}
      />
    </AuthProvider>
  );
}

export default App;
