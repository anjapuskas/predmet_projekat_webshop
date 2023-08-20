import styles from './AddProductForm.module.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { addProductAction, deleteProductAction, getProductsOfSellerAction } from 'slices/productSlice';
import Navigation from 'components/Navigation/Navigation';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';


const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  let products = useSelector((state) => state.products.products);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {

    
    // @ts-ignore
    dispatch(getProductsOfSellerAction(user.id));
  }, []);

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

  const handleDelete = (id) => {

    // @ts-ignore
    dispatch(deleteProductAction(id));

    window.location.reload();

    
  };

  const handleEdit = (product) => {
    navigate('/product-edit', { state: { product: product } });
  };

  const handleSubmit = (event) => {
    

    const formData = new FormData(event.currentTarget);
    const amount = formData.get('amount');
    const price = formData.get('price');
    const name = formData.get('name');
    const description = formData.get('description');
    formData.append('pictureFile', picture);

    if (
      amount == null ||
      price == null ||
      name == null 
    ) {
      toast.error('Please add the Name Amount and Price', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if(Number(amount) <= 0 || Number(price) <= 0) {
      
      toast.error('Amount and price must be greater than zero', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    event.preventDefault();

    // @ts-ignore
    dispatch(addProductAction(formData));
    window.location.reload();
    
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
        {products.length > 0 ? (<TableContainer component={Paper} className={styles.tableContainer}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
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
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="secondary" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => handleDelete(product.id)}>
                        Delete
                      </Button>                
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={styles.placeholder}>No products available</div>
        )}
        </Grid>
        <Grid item>
            <div className={styles.formContainer}>
            <Typography variant="h2" component="h2" className={styles.title}>
              Add Product
            </Typography>
            <form className={styles.form} onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                className={styles.input}
                label="Product Name"
                name="name"
                value={productName}
                onChange={handleProductNameChange}
              />
              <TextField
                margin="normal"
                className={styles.input}
                label="Price"
                name="price"
                value={price}
                onChange={handlePriceChange}
            />
            <TextField
                margin="normal"
                className={styles.input}
                label="Amount"
                name="amount"
                value={amount}
                onChange={handleAmountChange}
              />
              <TextField
                margin="normal"
                className={styles.input}
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
              />
              <div>
                <label>Picture:</label>
                <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])} />
              </div>
              <Button type="submit" variant="contained" className={styles.button}>
                Add Product
              </Button>
            </form>
          </div>
        </Grid>
    </Grid> 
    </Container>
    </>
  );
};

export default AddProductForm;
