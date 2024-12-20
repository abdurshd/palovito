import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { OrderForm } from './components/OrderForm'
import { Dashboard } from './components/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider, ToastViewport } from './components/ui/toast'
import { Sidebar } from './components/Sidebar'
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
                  <Route path="/order" element={
                    <div className="max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold mb-6">Place New Order</h2>
                      <OrderForm />
                    </div>
                  } />
                  <Route path="/dashboard" element={
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Order Dashboard</h2>
                      <Dashboard />
                    </div>
                  } />
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
