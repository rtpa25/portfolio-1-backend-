/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  products: any[];
  quantity: number;
  total: number;
  isFetching: boolean;
  error: boolean;
}

const initialState: CartState = {
  products: [],
  quantity: 0,
  total: 0,
  isFetching: false,
  error: false,
};

const CartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    loadingStart: (state) => {
      state.isFetching = true;
    },
    loadingFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    loadingsucess: (state) => {
      state.isFetching = false;
    },
    updateQuantity: (state, action: PayloadAction<{ quantity: number }>) => {
      state.quantity = action.payload.quantity;
    },
    updateProducts: (state, action: PayloadAction<{ cartItem: any[] }>) => {
      state.products = action.payload.cartItem;
    },
    updateTotal: (state, action: PayloadAction<{ total: number }>) => {
      state.total = action.payload.total;
    },
    addProduct: (
      state,
      action: PayloadAction<{ product: any; price: number; quantity: number }>
    ) => {
      state.quantity += 1;
      const { product, price, quantity } = action.payload;
      state.products.push(product);
      state.total += price * quantity;
    },
  },
});

export const {
  addProduct,
  loadingStart,
  loadingFailed,
  loadingsucess,
  updateQuantity,
  updateProducts,
  updateTotal,
} = CartSlice.actions;
export default CartSlice.reducer;
