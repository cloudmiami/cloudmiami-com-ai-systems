import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import WebArchitecture from './pages/WebArchitecture';
import SeoContent from './pages/SeoContent';
import VideoProduction from './pages/VideoProduction';
import Admi from './pages/Admi';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admi';

  return (
    <>
      <ScrollToTop />
      {isAdmin ? (
        <Routes>
          <Route path="/admi" element={<Admi />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/web-architecture" element={<WebArchitecture />} />
            <Route path="/seo-content" element={<SeoContent />} />
            <Route path="/video-production" element={<VideoProduction />} />
          </Routes>
          <Chatbot />
        </Layout>
      )}
    </>
  );
}

export default App;
