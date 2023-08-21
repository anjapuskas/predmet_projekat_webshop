import styles from './NewOrdersListForm.module.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import Navigation from 'components/Navigation/Navigation';
import { approveOrderAction, cancelOrder, getAllOrdersAction, getNewOrdersAction } from 'slices/orderSlice';
import { useNavigate } from 'react-router';
import CountdownTimer from 'components/Shared/CountdownTimer';

const NewOrdersListForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {

    // @ts-ignore
    dispatch(getNewOrdersAction(user.id));
  }, []);

  const handleDetails = (orderId) => {
    navigate('/order-details', { state: { orderId: orderId } });
  };

  const handleApprove = (orderId) => {

    
    // @ts-ignore
    dispatch(approveOrderAction(orderId));
    window.location.reload();
  };

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>User Id</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>Delivery Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.userId}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.created}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>{order.approved ? "Yes" : "No"}</TableCell>
              <TableCell>
              {!order.approved && (<Button variant="outlined" color="secondary" onClick={() => handleApprove(order.id)}>
                  Approve
                </Button>     
              )} 
                <Button variant="outlined" color="secondary" onClick={() => handleDetails(order.id)}>
                  Details
                </Button>                
              </TableCell>
              {order.orderStatus === 'ORDERED' ? (
              <CountdownTimer deliveryTime={order.deliveryTime} />
              ) : (
                <TableCell>{order.deliveryTime}</TableCell>
                )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
    </>
  );
};

export default NewOrdersListForm;
