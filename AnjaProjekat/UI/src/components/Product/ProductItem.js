import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Divider, Box } from '@mui/material';
import styles from './ProductItem.module.css';
import ProductAddToCart from './ProductAddToCart';

const ProductItem = (product) => {
  return (
    <Box
    sx={{
      width: 400,
      paddingLeft: "30px",
      paddingRight: "100px",
      paddingBottom: "40px"
    }}
  >
<Card className={styles.container}>
    <CardContent>
    <div className={styles.content}>
        <Grid   container
                direction="column"
                justifyContent="space-between"
                alignItems="center">
            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Grid item>
                    <div className={styles.title}>
                        <Typography variant="h4" component="h4">
                            {product.item.name}
                        </Typography>
                    </div>
                </Grid>
                <Grid item>
                    <div className={styles.imageContainer}>
                        <img
                        src={`data:image/jpg;base64,${product.item.picture}`}
                        alt="No picture"
                        className={styles.image}
                        />
                    </div>
                </Grid>
            </Grid>
            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Grid item>
                    <Typography variant="body1" component="p">
                        {product.item.description}
                    </Typography>  
                </Grid>
                <Grid item>
                <Typography variant="body2" component="p" className={styles.price}>
                    Price: {product.item.price} $
                </Typography>
                <Typography variant="body2" component="p" className={styles.price}>
                    Amount: {product.item.amount}
                </Typography>
                <ProductAddToCart item={product.item}/>
                </Grid>
            </Grid>
        </Grid>
        </div>
    </CardContent>
</Card>
</Box>
  );
};

export default ProductItem;
