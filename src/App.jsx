import { Routes, Route } from 'react-router-dom';
import DoctorsPage from './pages/DoctorsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <DoctorsPage />
        } 
        />
    </Routes>
  );
}

export default App;
