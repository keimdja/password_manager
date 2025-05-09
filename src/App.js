// src/App.js
// import React from 'react';

// function App() {
//   return (
//     <div>
//       <h1>Password Manager</h1>
//       <p>Welcome to your Password Manager App!</p>
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import Login from './Login';

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import Dashboard from './dashboard';

// function App() {
//   return (
//     <div className="App">
//       <Dashboard />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/dashboard';
import EditPasswordDialog from './components/EditPasswordDialog';
import Settings from './components/Settings'; // Import the Settings component


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/edit-password" element={<EditPasswordDialog />} />
                <Route path="/settings" element={<Settings />} /> {/* Add the Settings route */}
            </Routes>
        </Router>
    );
}

export default App;



