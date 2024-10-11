import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthComponent from "./components/auth/AuthComponent/AuthComponent";
import LoginComponent from "./components/auth/LoginComponent/LoginComponent";
import SignUpComponent from "./components/auth/SignUpComponent/SignUpComponent";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
