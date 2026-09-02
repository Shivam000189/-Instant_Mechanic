import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { MechanicsPage } from '@/pages/MechanicsPage';
import { SplashLoader } from '@/components/ui/SplashLoader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 2 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SplashLoader />
      <BrowserRouter>
        <Routes>
          {/* Main App Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/mechanics" element={<MechanicsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;