import React from 'react';
import { useState } from 'react';
import styles from './HomeForm.module.css';
import { logout } from 'slices/userSlice';
import { useDispatch } from 'react-redux';
import { Divider, ListItemIcon, MenuItem, Menu } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import Navigation from 'components/Navigation/Navigation';

const HomeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile")
    handleMenuClose();
  };

  return (
    <div className={styles.container}>
      <Navigation/>
      <div className={styles.content}>
        <h1>Welcome to the Home Page</h1>
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default HomeForm;
