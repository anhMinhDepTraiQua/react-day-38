import { useContext } from "react";
import CartContext from "../contexts/CartContext/Context";

// custom hook: lấy giá trị từ CartContext. Nếu dùng ngoài Provider -> throw error
export default function useCart() {
  const ctx = useContext(CartContext);
  // kiểm tra rõ ràng: ctx === undefined nghĩa là không được bọc bởi Provider
  if (ctx === undefined) {
    // Throw error để developer biết đã dùng sai chỗ
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
