import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateJobPage from './pages/CreateJobPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateJobPage />} />
        <Route path="/jobs/:jobId" element={<ProcessingPage />} />
        <Route path="/jobs/:jobId/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

