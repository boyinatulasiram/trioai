import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import MyStriver from './pages/MyStriver';
import ChatMini from './pages/ChatMini';
import Writer from './pages/Writer';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="code" element={<MyStriver />} />
            <Route path="prompt" element={<ChatMini />} />
            <Route path="story" element={<Writer />} />
          </Route>
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
