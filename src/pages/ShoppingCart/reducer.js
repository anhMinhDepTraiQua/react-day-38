// initialState: cấu trúc mặc định của giỏ hàng
export const initialState = {
  items: [], // mảng các item: mỗi item { id, name, price, quantity }
  totalPrice: 0, // tổng tiền (number)
  totalQuantity: 0, // tổng số lượng (number)
};

// recalc: helper tính lại totalPrice và totalQuantity từ items
const recalc = (items) => {
  // totalQuantity: cộng dồn quantity của từng item
  const totalQuantity = items.reduce((s, it) => s + it.quantity, 0);
  // totalPrice: cộng dồn price * quantity của từng item
  const totalPrice = items.reduce((s, it) => s + it.price * it.quantity, 0);
  return { items, totalPrice, totalQuantity };
};

// reducer xử lý các action: ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART
export default function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      // payload là product: phải có ít nhất id, name, price
      const p = action.payload;
      // tìm item đã tồn tại trong giỏ
      const exist = state.items.find((i) => i.id === p.id);
      let items;
      if (exist) {
        // nếu đã tồn tại -> tăng quantity lên 1
        items = state.items.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // nếu chưa có -> thêm mới với quantity = 1
        items = [...state.items, { ...p, quantity: 1 }];
      }
      // trả về state mới đã được tính totals
      return recalc(items);
    }

    case "REMOVE_FROM_CART": {
      // payload là productId
      const items = state.items.filter((i) => i.id !== action.payload);
      return recalc(items);
    }

    case "UPDATE_QUANTITY": {
      // payload: { productId, quantity }
      const { productId, quantity } = action.payload;
      // map để cập nhật quantity; sau đó filter các item có quantity > 0
      const items = state.items
        .map((i) => (i.id === productId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      return recalc(items);
    }

    case "CLEAR_CART":
      // reset về initial
      return initialState;

    default:
      // nếu action không xác định -> trả về state hiện tại (an toàn)
      return state;
  }
}
