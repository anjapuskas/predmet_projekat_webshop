import styles from './ProductListForm.module.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, CssBaseline, Grid, Typography } from "@mui/material";
import { getAllProductsAction } from "slices/productSlice";

import Navigation from 'components/Navigation/Navigation';
import ProductItem from '../ProductItem';

const ProductListForm = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  let products = useSelector((state) => state.products.products);

  useEffect(() => {

    // @ts-ignore
    dispatch(getAllProductsAction());
  }, []);

  const items = products.map((product) => {
      return (
        <ProductItem
        key={product.id}
        item = {product}
        />
      );
    });

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
      <div className={styles.formContainer}>
        <Typography variant="h2" component="h2" className={styles.title}>
          Add Product
        </Typography>
        <Grid container sx={{ 
        display: "flex",
        flexDirection: "row" 
        }}>
          {items}
        </Grid>
      </div>
    </Container>
    </>
  );
};

export default ProductListForm;
