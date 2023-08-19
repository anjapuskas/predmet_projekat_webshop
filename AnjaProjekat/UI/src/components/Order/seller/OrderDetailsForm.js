import styles from './NewOrdersListForm.module.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import Navigation from 'components/Navigation/Navigation';
import { cancelOrder, getAllOrdersAction, getNewOrdersAction, getProductsForOrder } from 'slices/orderSlice';
import { useLocation, useNavigate } from 'react-router';

const OrderDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {state} = useLocation();
  const { orderId } = state;
  // @ts-ignore
  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  const orderProducts = useSelector((state) => state.order.orderProducts);

  useEffect(() => {

    // @ts-ignore
    dispatch(getProductsForOrder(orderId));
  }, []);

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
    {orderProducts.length > 0 ? (<TableContainer component={Paper} className={styles.tableContainer}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className={styles.imageCell}>
                    {product.picture && (
                      <img
                        src={`data:image/jpg;base64,${product.picture}`}
                        style={{ width: '80px', height: '80px' }}
                      />
                    )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>{product.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={styles.placeholder}>No products available</div>
        )}
    </Container>
    </>
  );
};

export default OrderDetailsForm;
