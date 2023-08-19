import axiosInstance from './AxiosService';

export const AddOrder = async (request) => {
    try {  
        const response = await axiosInstance.post(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/add`, request);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};

export const GetAllOrders = async (id) => {
    try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/${id}`);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};

export const GetDeliveredOrders = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/delivered`);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};

export const GetNewOrders = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/new`);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};

export const GetAdminOrders = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/admin`);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};

export const CancelOrder = async (id) => {
    try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/cancel/${id}`);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};

export const GetProductsForOrder = async (id) => {
    try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_APPLICATION_ENDPOINT}/orders/products/${id}`);
        return response.data;
    } catch (error) {
     throw new Error(error.response.data.error);
    }
};