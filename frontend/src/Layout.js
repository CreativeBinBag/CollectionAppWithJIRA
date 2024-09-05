import React, { useState } from 'react';
import Sidebar from './Admin/components/Sidebar';
import Topbar from './Admin/components/Topbar';
import { Outlet } from 'react-router-dom';
const Layout = () => {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Outlet /> {/* Render the nested routes here */}

      </main>
    </div>
  );
};

export default Layout;
