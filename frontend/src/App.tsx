import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { OrderForm } from './pages/OrderForm'
import { Dashboard } from './pages/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider, ToastViewport } from './components/ui/toast'
import { Sidebar } from './components/Sidebar'
import { MenuPage } from './pages/MenuPage'
import { CategoryPage } from './pages/CategoryPage'
import './App.css'

function App() {
  return (
    <Router>
      <ToastProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:ml-64 transition-all duration-300">
              <div className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/order" element={<OrderForm />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/categories" element={<CategoryPage />} />
                  <Route path="/menuItems" element={<MenuPage />} />
                  <Route path="/" element={<Navigate to="/order" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </ErrorBoundary>
        <ToastViewport />
      </ToastProvider>
    </Router>
  )
}

export default App
