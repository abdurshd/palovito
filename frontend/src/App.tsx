import { OrderForm } from './components/OrderForm'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Order System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Place New Order</h2>
          <OrderForm />
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Dashboard</h2>
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

export default App
