import  DefaultLayout  from './layouts/DefaultLayout.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Counter from './pages/Counter/index.jsx'
import CountDown from './pages/CountDown/index.jsx'
import './App.css'
import ShoppingCart from './pages/ShoppingCart/index.jsx'
import CartProvider from "./contexts/CartContext/index.js";
function App() {
    return (
        <>
        <CartProvider>
            <BrowserRouter basename='/react-day-38'>
                <h1 className='text-2xl font-bold text-center py-8 text-blue-600'>
                    Chào mừng bạn đã đến với bài tập về nhà của Ngô Đình Nhật Minh k14 react day 38
                </h1>
                <DefaultLayout/>
                <Routes>
                    <Route path='/' element={<Counter />} />
                    <Route path='/counter' element={<Counter />} />
                    <Route path='/countDown' element={<CountDown />} />
                    <Route path='/shoppingCart' element={<ShoppingCart/>} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
        </>
    )
}

export default App;
