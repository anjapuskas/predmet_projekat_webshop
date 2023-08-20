import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemIcon, Divider, Typography } from '@mui/material';
import { AccountCircle, Logout, AddBox, ViewList, ViewStream, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from 'slices/userSlice';
import styles from './Navigation.module.css';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { removeFromCart } from 'slices/cartSlice';
import { removeProducts } from 'slices/productSlice';
import { removeOrders } from 'slices/orderSlice';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const userRole = useSelector((state) => state.user.user.userRole);
  const picture = useSelector((state) => state.user.user.picture);
  const numberOfItemsInCart = useSelector((state) => state.cart.amount);
  
  const isSeller = userRole === 'SELLER';
  const isBuyer = userRole === 'BUYER';
  const isAdmin = userRole === 'ADMIN';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleAddProductClick = () => {
    navigate('/add-product');
  };

  const handleProductsClick = () => {
    navigate('/products');
  };

  const handleOrdersClick = () => {
    navigate('/orders');
  };

  const handleNewOrdersClick = () => {
    navigate('/new-orders');
  };

  const handleDeliveredOrdersClick = () => {
    navigate('/delivered-orders');
  };

  const handleAdminOrdersClick = () => {
    navigate('/admin-orders');
  };

  const handleVerificationClick = () => {
    navigate('/verify-users');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    dispatch(removeFromCart());
    dispatch(removeProducts())
    dispatch(removeOrders())
    handleMenuClose();
  };

  return (
    <div >
      <AppBar className={styles.navbar} position="static" color="default">
        <Toolbar>
          <div>
            <IconButton edge="start" color="inherit" onClick={handleLogoClick}>
              <Typography variant="h6" component="span">
                Shop
              </Typography>
            </IconButton>
          </div>
          <div style={{ flexGrow: 1 }} />
          {isSeller && (
            <div style={{padding: 1}}>
              <IconButton edge="start" color="inherit" onClick={handleAddProductClick}>
                <AddBox />
                <Typography variant="body1" component="span">
                  Add Product
                </Typography>
              </IconButton>
            </div>
          )}
          {isBuyer && (
            <div style={{padding: 1}}>
              <IconButton edge="start" color="inherit" onClick={handleProductsClick}>
                <InventoryIcon />
                <Typography variant="body1" component="span">
                  Products
                </Typography>
              </IconButton>
            </div>
          )}
          {isBuyer && (
            <div style={{padding: 1}}>
              <IconButton edge="start" color="inherit" onClick={handleOrdersClick}>
                <ViewList />
                <Typography variant="body1" component="span">
                  Personal Orders
                </Typography>
              </IconButton>
            </div>
          )}
          {isSeller && (
            <div style={{padding: 1}}>
              <IconButton edge="start" color="inherit" onClick={handleDeliveredOrdersClick}>
                <ViewStream />
                <Typography variant="body1" component="span">
                  Delivered Orders
                </Typography>
              </IconButton>
            </div>
          )}
          {isSeller && (
            <div style={{padding: 1}}>
              <IconButton edge="start" color="inherit" onClick={handleNewOrdersClick}>
                <ViewStream />
                <Typography variant="body1" component="span">
                  New Orders
                </Typography>
              </IconButton>
            </div>
          )}
          {isAdmin && (
            <div style={{padding: 1}}>
              <IconButton edge="start" color="inherit" onClick={handleAdminOrdersClick}>
                <ViewStream />
                <Typography variant="body1" component="span">
                  All Orders
                </Typography>
              </IconButton>
            </div>
          )}
          {isAdmin && (
            <div>
              <IconButton edge="start" color="inherit" onClick={handleVerificationClick}>
                <People />
                <Typography variant="body1" component="span">
                  Verify Users
                </Typography>
              </IconButton>
            </div>
          )}
          <div style={{ flexGrow: 1 }} />
          {(isBuyer) && (
            <div>
              <IconButton edge="start" color="inherit" onClick={handleCartClick}>
                <ShoppingCartIcon />
                {numberOfItemsInCart > 0 && <span className={styles.cartItemCount}>{numberOfItemsInCart}</span>}
              </IconButton>
            </div>
          )}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            {picture && (
                <img
                  src={`data:image/jpg;base64,${picture}`}
                  alt="Profilna slika"
                  style={{ width: '80px', height: '80px' }}
                />
              )}
            {!picture && (
              <AccountCircle fontSize="small" />
            )}
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
              {picture && (
                <img
                  src={`data:image/jpg;base64,${picture}`}
                  alt="Profilna slika"
                  style={{ width: '80px', height: '80px' }}
                />
              )}
            {!picture && (
              <AccountCircle fontSize="small" />
            )}
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;
