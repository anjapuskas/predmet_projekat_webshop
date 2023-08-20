import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "models/User";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GetSellersForVerification, GoogleLogin, Home, Login, Profile, ProfileImage, Register, RejectUser, VerifyUser } from "services/UserService";

const initialState = {
  token: localStorage.getItem("token"),
  loggedIn: localStorage.getItem("token") != null,
  user: localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : null,
  sellers : [],
  registered : false
};
  
  export const loginAction = createAsyncThunk(
    "user/login",
    async (data, thunkApi) => {
      try {
      
        const response = await Login(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const homeAction = createAsyncThunk(
    "user/home",
    async (data, thunkApi) => {
      try {
      
        const response = await Home();
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const registerAction = createAsyncThunk(
    "user/register",
    async (data, thunkApi) => {
      try {
      
        const response = await Register(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const profileAction = createAsyncThunk(
    "user/profile",
    async (data, thunkApi) => {
      try {
      
        const response = await Profile(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const profileImageAction = createAsyncThunk(
    "user/profile/image",
    async (id, thunkApi) => {
      try {
      
        const response = await ProfileImage(id);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const getSellersForVerification = createAsyncThunk(
    "user/verify-list",
    async (data, thunkApi) => {
      try {
        const response = await GetSellersForVerification();
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const verifySeller = createAsyncThunk(
    "user/verify",
    async (data, thunkApi) => {
      try {
        const response = await VerifyUser(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const rejectSeller = createAsyncThunk(
    "user/reject",
    async (data, thunkApi) => {
      try {
        const response = await RejectUser(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  export const googleLoginAction = createAsyncThunk(
    "user/google-login",
    async (data, thunkApi) => {
      try {
        const response = await GoogleLogin(data);
        return thunkApi.fulfillWithValue(response);
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      logout: (state) => {
        state.token = null;
        state.loggedIn = false;
        state.sellers = [];
        localStorage.removeItem("token");
      },
    },
    extraReducers: (builder) => {
        builder.addCase(loginAction.fulfilled, (state, action) => {
          const token = action.payload.token;
          state.token = token;
          state.loggedIn = true;
          state.user = action.payload;
    
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(action.payload));
        });
        builder.addCase(loginAction.rejected, (state, action) => {
          let error = "LOGIN ERROR"; 
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
        builder.addCase(googleLoginAction.fulfilled, (state, action) => {
          const token = action.payload.token;
          state.token = token;
          state.loggedIn = true;
          state.user = action.payload;
    
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(action.payload));
        });
        builder.addCase(registerAction.fulfilled, (state, action) => {
          state.registered = true;
          toast.success('Registration successful', {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
        });
        builder.addCase(registerAction.rejected, (state, action) => {
          state.registered = false;
          let error = "REGISTRATION ERROR"; 
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
        builder.addCase(profileAction.fulfilled, (state, action) => {
          state.user.firstName = action.payload.firstName;
          state.user.lastName = action.payload.lastName;
          state.user.address = action.payload.address;
          state.user.dateOfBirth = action.payload.dateOfBirth;
          state.user.picture = action.payload.picture;
          
          toast.success("Profile has been updated", {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
        });
        builder.addCase(profileImageAction.fulfilled, (state, action) => {
          state.user = { ...state.user, imageSrc: action.payload };
        });
        builder.addCase(getSellersForVerification.fulfilled, (state, action) => {
          state.sellers = action.payload.map(u => new User(u));
        });
        builder.addCase(verifySeller.fulfilled, (state, action) => {
          toast.success("The user has been verified", {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
          state.sellers = action.payload.map(u => new User(u));

        });
        builder.addCase(rejectSeller.fulfilled, (state, action) => {
          toast.success("The user has been rejected", {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
          });
          state.sellers = action.payload.map(u => new User(u));
        });
    },
    
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;