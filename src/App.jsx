import MainLayouts from "@/layouts/MainLayouts";
import HomeLayouts from "@/layouts/HomeLayouts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  HomePage, Dashboard, Login, LogPage, RequestPage
} from "@/pages/index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayouts />} >
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<MainLayouts />}>
          <Route path="/dashboard" element={ <Dashboard /> } />
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