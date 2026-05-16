import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AudioNotesPage } from './pages/AudioNotesPage';
import { WelcomePage } from './pages/WelcomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/app" element={<AudioNotesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
