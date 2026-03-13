import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { ProactiveSurface } from './components/ProactiveSurface';
import { ActiveThreads } from './components/ActiveThreads';
import { HomePage } from './pages/HomePage';
import { MemoryFeedPage } from './pages/MemoryFeedPage';
import { PeoplePage } from './pages/PeoplePage';
import { PatternsPage } from './pages/PatternsPage';
import { UnresolvedPage } from './pages/UnresolvedPage';
import DemoPage from './pages/DemoPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <SidebarNav />
      
      {/* Main content */}
      <main className="flex-1 min-h-screen p-6 lg:p-8 lg:ml-[220px] xl:pr-[360px]">
        <div className="max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feed" element={<MemoryFeedPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/unresolved" element={<UnresolvedPage />} />
          </Routes>
        </div>
      </main>
      
      {/* Right sidebar - hidden on smaller screens */}
      <aside className="hidden xl:block fixed top-0 right-0 h-full w-[280px] border-l border-white/5 p-6 overflow-y-auto bg-background">
        <div className="pt-6">
          <ProactiveSurface />
          <div className="mt-8">
            <ActiveThreads />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
