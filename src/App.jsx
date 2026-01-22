import MainLayouts from "@/layouts/MainLayouts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  Home, Login 
} from "@/pages/index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayouts />}>
          <Route path="/" element={ <Home /> } />
          <Route path="/notification" />
          <Route path="/report" />
          <Route path="/admin/logs" />
          <Route path="/admin/requests"  />
        </Route>
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </BrowserRouter>
  )
}