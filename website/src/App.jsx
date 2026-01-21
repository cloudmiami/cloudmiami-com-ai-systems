import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import WebArchitecture from './pages/WebArchitecture';
import SeoContent from './pages/SeoContent';
import VideoProduction from './pages/VideoProduction';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/web-architecture" element={<WebArchitecture />} />
        <Route path="/seo-content" element={<SeoContent />} />
        <Route path="/video-production" element={<VideoProduction />} />
      </Routes>
      <Chatbot />
    </Layout>
  );
}

export default App;
