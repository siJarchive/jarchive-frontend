import MainLayouts from "@/layouts/MainLayouts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  Home, Login, LogPage, RequestPage
} from "@/pages/index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayouts />}>
          <Route path="/" element={ <Home /> } />
          <Route path="/notification" />
          <Route path="/report" />
          <Route path="/admin/logs" element={ <LogPage /> } />
          <Route path="/admin/requests" element={ <RequestPage /> }  />
        </Route>
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </BrowserRouter>
  )
}