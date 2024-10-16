import React from "react"
import { Route, Routes } from "react-router-dom"
import OverviewPage from "./pages/OverviewPage"
import ProfitsPage from "./pages/ProfitsPage"
import Sidebar from "./components/common/Sidebar"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error(error, errorInfo);
    // You can also display a fallback UI here
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI here
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
function App() {

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>

      <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 backdrop:blur-sm bg-gradient-to-br from-teal-800 to-teal-300"></div>       
       <div className="absolute inset-0 backdrop:blur-sm"></div>
      </div>

      <Sidebar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/profits" element={<ProfitsPage />} />
        </Routes>
        </ErrorBoundary>
    </div>
  )

}

export default App


