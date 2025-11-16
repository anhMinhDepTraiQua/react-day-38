import React, { useEffect, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import CartContext from "./Context";

const initialState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

function calculateTotals(items) {
  const totalPrice = items.reduce((sum, it) => {
    const price = typeof it.price === "number" ? it.price : 0;
    const qty = typeof it.quantity === "number" ? it.quantity : 0;
    return sum + price * qty;
  }, 0);
  const totalQuantity = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  return { totalPrice, totalQuantity };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const p = action.payload;
      const qtyToAdd = typeof p.quantity === "number" ? p.quantity : 1;
      const exists = state.items.find((it) => it.id === p.id);
      let items;
      if (exists) {
        items = state.items.map((it) =>
          it.id === p.id ? { ...it, quantity: it.quantity + qtyToAdd } : it
        );
      } else {
        items = [...state.items, { ...p, quantity: qtyToAdd }];
      }
      return { ...state, ...calculateTotals(items), items };
    }

    case "REMOVE_FROM_CART": {
      const id = action.payload;
      const items = state.items.filter((it) => it.id !== id);
      return { ...state, ...calculateTotals(items), items };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      let items = state.items
        .map((it) => (it.id === productId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0);
      return { ...state, ...calculateTotals(items), items };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}



// KEY localStorage để lưu cart
const KEY = "app_cart_v1";

export default function CartProvider({ children }) {
  // lazyInit: đọc localStorage 1 lần khi init reducer
  // dùng lazy init để tránh gọi localStorage mỗi render
  const lazyInit = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return initialState; // nếu chưa có dữ liệu thì trả về initial
      const parsed = JSON.parse(raw);
      // đảm bảo cấu trúc (nếu thiếu trường nào thì mặc định)
      return {
        items: parsed.items || [],
        totalPrice: parsed.totalPrice || 0,
        totalQuantity: parsed.totalQuantity || 0,
      };
    } catch (e) {
      // nếu parse lỗi -> log và dùng initialState
      console.error("Failed to parse cart from localStorage", e);
      return initialState;
    }
  };

  // useReducer với lazy init
  const [state, dispatch] = useReducer(reducer, undefined, lazyInit);

  // mỗi khi state thay đổi -> lưu vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [state]);

  // useMemo trả về object value chứa state + các method để tránh recreate khi không cần thiết
  const value = useMemo(
    () => ({
      state,
      // addToCart: dispatch action ADD_TO_CART
      addToCart: (p) => dispatch({ type: "ADD_TO_CART", payload: p }),
      // removeFromCart: dispatch action REMOVE_FROM_CART
      removeFromCart: (id) =>
        dispatch({ type: "REMOVE_FROM_CART", payload: id }),
      // updateQuantity: dispatch action UPDATE_QUANTITY
      updateQuantity: (id, q) =>
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId: id, quantity: q },
        }),
      // clearCart: dispatch action CLEAR_CART
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [state]
  );

  // Provider bọc children để các component con dùng useContext(CartContext)
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  // children bắt buộc
  children: PropTypes.node.isRequired,
};
