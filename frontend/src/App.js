import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <img src="/mylogo.png" alt="LOGO" className="header-logo" />
          </div>
          <div className="auth-buttons">
            <button onClick={() => alert('Login coming soon!')}>Login</button>
            <button onClick={() => alert('Logout coming soon!')}>Logout</button>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items" element={<ItemsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
