import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useCart from "../../hooks/useCart";

function CartIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor">
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h3l3 12h10l3-8H6" strokeWidth="2" />
    </svg>
  );
}

function ProductCard({ product, onAdd }) {
  const name = product?.title ?? "(No name)";
  const price = typeof product?.price === "number" ? product.price : null;
  const avatar = product?.thumbnail ?? product?.image ?? null;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">

      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-40 object-cover mb-3 rounded" />
      ) : (
        <div className="w-full h-40 bg-gray-200 mb-3 rounded flex items-center justify-center text-gray-500">
          No image
        </div>
      )}

      <h3 className="font-semibold text-lg">{name}</h3>

      <p className="text-gray-600 mb-3">
        {price !== null ? price.toLocaleString() + "đ" : "Price unavailable"}
      </p>

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded"
        onClick={() => onAdd && onAdd(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}


ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
};

function Header() {
  const { state = { items: [], totalQuantity: 0, totalPrice: 0 }, updateQuantity, removeFromCart, clearCart } = useCart() || {};
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      <h2 className="text-xl font-bold">My Shop</h2>

      <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <div className="flex items-center cursor-pointer gap-2" onClick={() => setOpen(v => !v)}>
          <CartIcon />
          {state.totalQuantity > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {state.totalQuantity}
            </span>
          )}
        </div>

        {open && (
          <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl border rounded-lg p-4 z-50">
            <h4 className="font-semibold mb-3">Cart</h4>
            {state.totalQuantity === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                <ul className="max-h-60 overflow-auto divide-y">
                  {state.items.map(it => (
                    <li key={it.id} className="flex justify-between items-center py-3">
                      <div>
                        <div className="font-semibold">{it.name}</div>
                        <div className="text-sm text-gray-500">
                          {(it.price * it.quantity).toLocaleString()}đ ({it.quantity} × {it.price?.toLocaleString() ?? 0}đ)
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateQuantity && updateQuantity(it.id, it.quantity - 1)}>-</button>
                        <span>{it.quantity}</span>
                        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateQuantity && updateQuantity(it.id, it.quantity + 1)}>+</button>
                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeFromCart && removeFromCart(it.id)}>x</button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center mt-4 font-semibold">
                  <span>Total:</span>
                  <span>{state.totalPrice?.toLocaleString() ?? 0}đ</span>
                </div>

                <button className="mt-3 w-full text-center bg-red-500 text-white py-1 rounded" onClick={() => clearCart && clearCart()}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default function ShoppingCartPage() {
  const { addToCart } = useCart() || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

async function load() {
  try {
    const res = await fetch("https://api01.f8team.dev/api/products");
    if (!res.ok) throw new Error("HTTP " + res.status);

    const json = await res.json();
    console.log("API JSON:", json);

    const items = json?.data?.items ?? [];
    setProducts(items);
  } catch (err) {
    console.error("Fetch error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}


    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <Header />

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Products</h2>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.length === 0 && !loading && !error && <div className="col-span-full text-gray-500">No products to show.</div>}
          {products.map((p) => (
            <ProductCard key={p.id ?? JSON.stringify(p)} product={p} onAdd={addToCart} />
          ))}
        </div>
      </main>
    </div>
  );
}
