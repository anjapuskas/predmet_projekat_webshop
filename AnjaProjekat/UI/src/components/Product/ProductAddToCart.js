import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Divider, Box, IconButton } from '@mui/material';
import styles from './ProductAddToCart.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from 'slices/cartSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { amountProductChange } from 'slices/productSlice';

const ProductAddToCart = (product) => {

    const dispatch = useDispatch();
    let products = useSelector((state) => state.products.products);

    const handleAddToCart = () => {
        
        if(product.item.amount - 1 >= 0) {
          dispatch(addToCart(product.item))
          dispatch(amountProductChange(product.item))
        }
        
      };

  return (<>
    <IconButton edge="start" color="inherit" onClick={handleAddToCart} >
      <AddShoppingCartIcon sx={{
      paddingLeft: "40px"
    }}/>
    </IconButton>
  </>
     );
};

export default ProductAddToCart;
