import styles from './CartForm.module.css';
import React, { useState } from 'react';
import { Box, Button, Card, Container, FormControlLabel, Grid, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { addProductAction } from 'slices/productSlice';
import Navigation from 'components/Navigation/Navigation';
import { amountChange, removeFromCart } from 'slices/cartSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addOrderAction } from 'slices/orderSlice';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const CartForm = () => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const products = useSelector((state) => state.cart.products);
    const differentSellers = useSelector((state) => state.cart.differentSellers);
    const amount = useSelector((state) => state.cart.amount);
    const price = useSelector((state) => state.cart.price);
    const id = useSelector((state) => state.user.user.id);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handlePaymentMethod = (event) => {
      setPaymentMethod(event.target.value);
    }

    const handleAmountChange = (id, increment) => {
        const amountChangeObj = {
            id: id, 
            increment: increment
        }
        dispatch(amountChange(amountChangeObj))
      };

    const orderFromCart = () => {
      const order = {
        products: products,
        address: address,
        comment: comment,
        amount: amount,
        price: price,
        userId: id
      };

      if(!address) {
        toast.error('Please add a address', {
          position: 'top-center',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
        });
        return;
      }
  
      // @ts-ignore
      dispatch(addOrderAction(order));
      dispatch(removeFromCart());
      toast.success('Order has been placed', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    
        orderFromCart();
      };

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
    <Grid   container
                direction="row"
                justifyContent="space-between"
                alignItems="center">
        <Grid item>
        <TableContainer component={Paper} className={styles.tableContainer}>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
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
              <TableCell sx={{
                textAlign: 'center'
              }}>
                {product.amount > 0 && (
                  <Button
                    onClick={() => handleAmountChange(product.id, -1)}
                    className={styles.amountButton}
                  >
                    <RemoveIcon/>
                  </Button>
                )}
                {product.amount}
                <Button
                  onClick={() => handleAmountChange(product.id, 1)}
                  className={styles.amountButton}
                >
                  <AddIcon/>
                </Button>
              </TableCell>
              <TableCell>${product.price * product.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </Grid>
        <Grid item>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Box className = {styles.box}>
                    <Card sx={{
                        p: 2,
                        borderRadius: "4px",
                        border: 1,
                    }}>
                    <Typography variant="h6" className={styles.title}>
                        Cart Summary
                    </Typography>
                    <Typography variant="body1" className={styles.summaryItem}>
                        Price in cart: {price} USD
                    </Typography>
                    <Typography variant="body1" className={styles.summaryItem}>
                        Delivery Price: {differentSellers.length * 10} USD
                    </Typography>
                    <Typography variant="body1" className={styles.summaryItem}>
                        Total Price: {price + differentSellers.length * 10} USD
                    </Typography>
                    <Typography variant="body1" className={styles.summaryItem}>
                        Total Amount: {amount}
                    </Typography>
                    <TextField
                    margin="normal"
                        className={styles.input}
                        label="Comment"
                        name="comment"
                        multiline
                        rows={2}
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <TextField
                    margin="normal"
                        className={styles.input}
                        label="Address"
                        name="address"
                        multiline
                        rows={2}
                        value={address}
                        onChange={handleAddressChange}
                    />
                    <Button variant="contained" type="submit" color="primary" className={styles.button} fullWidth>
                        Proceed to Checkout
                    </Button>
                    </Card>
                </Box>
            </form>
        </Grid>
    </Grid> 
    </Container>
    </>
  );
};

export default CartForm;
