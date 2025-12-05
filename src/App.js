import React from 'react';
import Admin from './Admin';

const App = () => {
  // 直接返回Admin组件
  return <Admin />;
};

export default App;



// import React, { useState ,useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Login';
// import Admin from './Admin';

// const App = () => {
//     // 初始化时从 localStorage 读取登录状态
//   const [isLogin, setIsLogin] = useState(() => localStorage.getItem('isLogin') === 'true');

//     useEffect(() => {
//     // 登录状态变化时同步到 localStorage
//     if (isLogin) {
//       localStorage.setItem('isLogin', 'true');
//     } else {
//       localStorage.removeItem('isLogin');
//     }
//   }, [isLogin]);

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/login"
//           element={<Login onLogin={() => setIsLogin(true)} />}
//         />
//         <Route
//           path="/admin"
//           element={
//             isLogin ? <Admin /> : <Navigate to="/login" replace />
//           }
//         />
//         <Route
//           path="/"
//           element={<Navigate to="/login" replace />}
//         />
//       </Routes>
//     </Router>
//   );
// };
// export default App;