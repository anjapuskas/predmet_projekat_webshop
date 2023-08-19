import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Product from "models/Product";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AddProduct, DeleteProduct, GetAllProducts, GetProductsOfSeller, UpdateProduct } from "services/ProductService";
import { Home, Login, Profile, ProfileImage, Register } from "services/UserService";

const initialState = {
  products : []
};
  
  export const addProductAction = createAsyncThunk(
    "products/add",
    async (data, thunkApi) => {
      try {
        const response = await AddProduct(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const updateProductAction = createAsyncThunk(
    "products/update",
    async (data, thunkApi) => {
      try {
        const response = await UpdateProduct(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const getAllProductsAction = createAsyncThunk(
    "products",
    async (data, thunkApi) => {
      try {
        const response = await GetAllProducts();
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const getProductsOfSellerAction = createAsyncThunk(
    "products/seller",
    async (data, thunkApi) => {
      try {
        const response = await GetProductsOfSeller(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const deleteProductAction = createAsyncThunk(
    "products/delete",
    async (data, thunkApi) => {
      try {
        const response = await DeleteProduct(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
      amountProductChange: (state, action) => {
        const item = state.products.find((item) => item.id == action.payload.id)
        if(item) {
            item.amount--;
        }
      },
      removeProducts: (state, action) => {
        state.products = []
      }
    },
    extraReducers: (builder) => {
        builder.addCase(addProductAction.fulfilled, (state, action) => {
          state.products = action.payload.map(p => new Product(p));
        });
        builder.addCase(addProductAction.rejected, (state, action) => {
          let error = ""; 
          if (typeof action.payload === "string") {
            error = action.payload;
          }
    
          toast.error(error, {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
        });
        builder.addCase(updateProductAction.fulfilled, (state, action) => {
          state.products = action.payload.map(p => new Product(p));
        });
        builder.addCase(updateProductAction.rejected, (state, action) => {
          let error = ""; 
          if (typeof action.payload === "string") {
            error = action.payload;
          }
    
          toast.error(error, {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
        });
        builder.addCase(getAllProductsAction.fulfilled, (state, action) => {
          state.products = action.payload;
        });
        builder.addCase(getProductsOfSellerAction.fulfilled, (state, action) => {
          state.products = action.payload.map(p => new Product(p));
        });
        builder.addCase(deleteProductAction.fulfilled, (state, action) => {
        });
    }
    
});
export const { amountProductChange, removeProducts } = productSlice.actions;

export default productSlice.reducer;