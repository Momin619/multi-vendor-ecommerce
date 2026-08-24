import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-gray-100 text-blue-600"
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo / Brand */}
        <NavLink
          to="/"
          className="text-lg font-bold text-gray-900"
          onClick={handleLinkClick}
        >
          E-Commerce
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && user ? (
            <>
              {/* Seller Navigation */}
              {user.role === "seller" && (
                <>
                  <NavLink
                    to="/dashboard/seller"
                    end
                    className={linkClass}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/seller/products"
                    end
                    className={linkClass}
                  >
                    My Products
                  </NavLink>

                  <NavLink
                    to="/seller/products/create"
                    end
                    className={linkClass}
                  >
                    Add Product
                  </NavLink>
                </>
              )}

              {/* Customer Navigation */}
              {user.role === "customer" && (
                <>
                  <NavLink
                    to="/dashboard/customer"
                    end
                    className={linkClass}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/customer/products"
                    end
                    className={linkClass}
                  >
                    Products
                  </NavLink>

                  <NavLink
                    to="/customer/orders"
                    end
                    className={linkClass}
                  >
                    Orders
                  </NavLink>
                </>
              )}
            </>
          ) : (
            /* Logged-out Navigation */
            <>
              <NavLink
                to="/login"
                end
                className={linkClass}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                end
                className={linkClass}
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() =>
            setIsMenuOpen((previous) => !previous)
          }
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label={
            isMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {isAuthenticated && user ? (
              <>
                {/* Seller Mobile Navigation */}
                {user.role === "seller" && (
                  <>
                    <NavLink
                      to="/seller/products"
                      end
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      My Products
                    </NavLink>

                    <NavLink
                      to="/seller/products/create"
                      end
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      Add Product
                    </NavLink>
                  </>
                )}

                {/* Customer Mobile Navigation */}
                {user.role === "customer" && (
                  <>
                    <NavLink
                      to="/dashboard/customer"
                      end
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/customer/products"
                      end
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      Products
                    </NavLink>

                    <NavLink
                      to="/customer/orders"
                      end
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      Orders
                    </NavLink>
                  </>
                )}
              </>
            ) : (
              /* Logged-out Mobile Navigation */
              <>
                <NavLink
                  to="/login"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;