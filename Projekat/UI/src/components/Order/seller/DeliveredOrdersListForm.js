import styles from './NewOrdersListForm.module.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import Navigation from 'components/Navigation/Navigation';
import { cancelOrder, getAllOrdersAction, getDeliveredOrdersAction, getNewOrdersAction } from 'slices/orderSlice';
import { useNavigate } from 'react-router';

const DeliveredOrdersListForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {

    
    dispatch(getDeliveredOrdersAction(user.id));
  }, []);

  const handleDetails = (orderId) => {
    navigate('/order-details', { state: { orderId: orderId } });
  };

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
    <Typography variant="h2" component="h2" className={styles.title}>
      Delivered Orders
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>User Id</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.userId}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.created}</TableCell>
              <TableCell>{order.deliveryTime}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleDetails(order.id)}>
                  Details
                </Button>                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
    </>
  );
};

export default DeliveredOrdersListForm;
