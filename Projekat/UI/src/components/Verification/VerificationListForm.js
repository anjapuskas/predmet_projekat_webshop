import styles from './VerificationForm.module.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { verifySeller, rejectSeller, getSellersForVerification } from 'slices/userSlice';

import Navigation from 'components/Navigation/Navigation';

const VerificationListForm = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const user = useSelector((state) => state.user.user);

  // @ts-ignore
  const sellers = useSelector((state) => state.user.sellers);

  useEffect(() => {

    // @ts-ignore
    dispatch(getSellersForVerification());
  }, []);

  const handleVerify = (id) => {
    // @ts-ignore
    dispatch(verifySeller(id));
  };

  const handleReject = (id) => {
    // @ts-ignore
    dispatch(rejectSeller(id));
  };

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>User Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellers.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.address}</TableCell>
              <TableCell>{u.dateOfBirth}</TableCell>
              <TableCell>{u.userStatus}</TableCell>
              <TableCell>
                <Button disabled={u.userStatus!=='ON_HOLD'} variant="outlined" color="secondary" onClick={() => handleVerify(u.id)}>
                  Verify
                </Button>                
                <Button disabled={u.userStatus!=='ON_HOLD'} variant="outlined" color="secondary" onClick={() => handleReject(u.id)}>
                  Reject
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

export default VerificationListForm;
