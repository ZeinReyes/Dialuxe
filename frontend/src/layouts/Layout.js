import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';

const Layout = () => {
    return (
        <>
            <CustomNavbar />
            <div className="content-wrapper">
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
