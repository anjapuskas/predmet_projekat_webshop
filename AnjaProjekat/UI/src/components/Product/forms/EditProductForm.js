import styles from './AddProductForm.module.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { addProductAction, deleteProductAction, getProductsOfSellerAction, updateProductAction } from 'slices/productSlice';
import Navigation from 'components/Navigation/Navigation';
import { useLocation, useNavigate } from 'react-router';

const EditProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const {state} = useLocation();
  const { product } = state;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {

    const formData = new FormData(event.currentTarget);
    formData.append('id', product.id);
    formData.append('pictureFile', picture);
    event.preventDefault();

    
    // @ts-ignore
    dispatch(updateProductAction(formData));
    navigate('/add-product');
    
  };

  return (
    <>
    <Navigation/>
    <Container className={styles.container}>
      <div className={styles.formContainer}>
        <Typography variant="h2" component="h2" className={styles.title}>
          Edit Product
        </Typography>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            className={styles.input}
            label="Product Name"
            name="name"
            defaultValue={product.name}
            onChange={handleProductNameChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="Price"
            name="price"
            defaultValue={product.price}
            onChange={handlePriceChange}
        />
        <TextField
            margin="normal"
            className={styles.input}
            label="Amount"
            name="amount"
            defaultValue={product.amount}
            onChange={handleAmountChange}
          />
          <TextField
            margin="normal"
            className={styles.input}
            label="Description"
            name="description"
            multiline
            rows={4}
            defaultValue={product.description}
            onChange={handleDescriptionChange}
          />
          <div>
            <label>Picture:</label>
            <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])} />
          </div>
          <Button type="submit" variant="contained" className={styles.button}>
            Edit Product
          </Button>
        </form>
      </div>
    </Container>
    </>
  );
};

export default EditProductForm;
