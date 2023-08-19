import styles from './AdminOrdersListForm.module.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import Navigation from 'components/Navigation/Navigation';
import { cancelOrder, getAdminOrdersAction } from 'slices/orderSlice';

const AdminOrdersListForm = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {

    // @ts-ignore
    dispatch(getAdminOrdersAction());
  }, []);

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.created}</TableCell>
              <TableCell>{order.deliveryTime}</TableCell>
              <TableCell>{order.orderStatus}</TableCell>
              <TableCell>{order.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
    </>
  );
};

export default AdminOrdersListForm;
