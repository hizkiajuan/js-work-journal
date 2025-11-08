import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useCallback, useState } from 'react';
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Entries from "./pages/Entries";
import Ideas from "./pages/Ideas";

const AppShell = () => {
  const location = useLocation();
  const [addEntry, setAddEntry] = useState<() => void>(() => () => {});

  const path = location.pathname;
  const isEntriesRoute = path === '/entries';

  const title = path === '/ideas'
    ? 'Ideas & Learning'
    : isEntriesRoute
      ? 'Entries'
      : 'Coming soon';

  const handleOpenDialog = useCallback(() => {
    addEntry();
  }, [addEntry]);

  return (
    <Layout title={title} handleOpenDialog={handleOpenDialog}>
      <Entries setAddEntry={setAddEntry} isVisible={isEntriesRoute} />
      <Routes>
        <Route path="/" element={<Navigate to="/entries" replace />} />
        <Route path="/entries" element={null} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
