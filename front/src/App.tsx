import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import TaskPage from "./pages/Task";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/task" element={<TaskPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
