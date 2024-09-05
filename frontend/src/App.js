import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Register from './credentials/Register';
import Login from './credentials/Login';
import ForgotPass from './credentials/ForgotPass';
import ResetPass from './credentials/ResetPass'; 
import PrivateRoute from './PrivateRoute';
import './index.css';
import ManageUsers from './Admin/pages/UserManagement/ManageUsers';
import ManageCollections from './Admin/pages/CollectionManagement/ManageCollections';
import ViewCollection from './Admin/pages/CollectionManagement/ViewCollection';
import NewCollectionForm from './Admin/pages/CollectionManagement/NewCollectionForm';
import NewItemForm from './Admin/pages/CollectionManagement/NewItemForm';
import HomePage from './Home/HomePage/HomePage';
import Layout from './Layout';
import HomeFeed from './Admin/pages/HomeFeed/HomeFeed';
import ViewTickets from './JIRA/ViewTickets';
const App = () => {
  const [theme, colorMode] = useMode(); // Assuming useMode is a custom hook

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          
          <RoutesWrapper />
        
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const RoutesWrapper = () => {
  const location = useLocation();
  console.log('Current Path:', location.pathname);


  return (
    <Routes>
      {/* Public routes without the sidebar/topbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPass />} />
      <Route path="/reset-password/:token" element={<ResetPass />} />
      <Route path="/" element={<HomePage />} />
      


      {/* Admin-only protected routes with sidebar/topbar */}
      <Route element={<PrivateRoute adminOnly={true} />}>
        <Route element={<Layout />}>
          <Route path="/feed" element={<HomeFeed />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/manage-collections" element={<ManageCollections />} />
          <Route path="/api/collections/:id/view" element={<ViewCollection />} />
          <Route path="/create-collection" element={<NewCollectionForm />} />
          <Route path="/api/items/:id/create" element={<NewItemForm />} />
        </Route>
      </Route>
    
       {/* Authenticated routes for Jira tickets */}
      <Route element={<PrivateRoute />}>
      <Route element={<Layout />}>
        <Route path="/user-tickets" element={<ViewTickets />} />
      </Route>
      </Route> 

    </Routes>
  );
};

export default App;
/*<Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password/:token" element={<ResetPass />} />
          
          <Route path="/" element={<Home />} /> */

/* */
