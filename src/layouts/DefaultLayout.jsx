import { NavLink } from "react-router";
const Navigation = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1"
      : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">    

      <div className="flex gap-6 text-lg ">
        <NavLink to="/counter" className={linkClass}>
        Counter
        </NavLink>
        <NavLink to="/countDown" className={linkClass}>
        Count Down
        </NavLink>
        <NavLink to="/shoppingCart" className={linkClass}>
        Shopping Cart
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;