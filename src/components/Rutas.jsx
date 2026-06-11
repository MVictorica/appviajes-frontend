import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import GlobalLoading from "./GlobalLoading.jsx";
import Pagina404 from "./Pagina404.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const Rutas = () => {
  const isLoading = useSelector((state) => state.loadingSlice.count > 0);

  return (
    <BrowserRouter>
      {isLoading && <GlobalLoading />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;