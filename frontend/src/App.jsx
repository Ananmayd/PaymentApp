import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Dashboard from "./pages/dashboard";
import TransferMoney from "./pages/transferMoney";


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/transfer" element={<TransferMoney/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
