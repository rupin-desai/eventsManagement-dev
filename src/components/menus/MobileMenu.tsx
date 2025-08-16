import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { X, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  fadeInVariants,
  cardVariants,
  iconVariants
} from "../../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";

interface NavItem {
  path: string;
  name: string;
  hasDropdown?: boolean;
  dropdownItems?: Array<{
    name: string;
    path: string;
    description?: string;
  }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeDropdown: number | null;
  toggleDropdown: (index: number | null) => void;
  logoutHandler?: () => void; // <-- add this prop
  role?: string; // <-- add this
}

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  activeDropdown,
  toggleDropdown,
  logoutHandler,
  role,
}: MobileMenuProps) => {
  const { colors } = useTheme();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      // Don't close immediately, let the user navigate
      const timer = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
      document.body.style.left = "0";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.left = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.left = "";
    };
  }, [isOpen]);

  const isActiveParent = (item: NavItem) => {
    if (location.pathname === item.path) return true;

    if (item.hasDropdown && item.dropdownItems) {
      return item.dropdownItems.some(
        (dropdownItem) => location.pathname === dropdownItem.path
      );
    }

    return false;
  };

  const isActiveDropdownItem = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[99998] md:hidden"
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            initial={{ transform: "translate3d(100%, 0px, 0px)" }}
            animate={{ transform: "translate3d(0px, 0px, 0px)" }}
            exit={{ transform: "translate3d(100%, 0px, 0px)" }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="fixed top-0 right-0 h-screen w-80 max-w-[90vw] bg-white shadow-2xl z-[99999] md:hidden flex flex-col"
            style={{ height: '100vh' }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 bg-white"
              variants={fadeInVariants("down", 0.1)}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center">
                <motion.div
                  className="mr-3"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <img 
                    src={`${BASE_URL}logos/smile_logo_full.png`} 
                    alt="Alkem Smile Logo"
                    className="h-28 w-auto "
                  />
                </motion.div>
                
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap={{ transform: "translate3d(0px, 0px, 0px) scale(0.9)" }}
              >
                <X size={20} className="text-gray-600" />
              </motion.button>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="flex-1 overflow-y-auto px-6 py-4 bg-white min-h-0"
              variants={cardVariants.container}
              initial="initial"
              animate="animate"
            >
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={cardVariants.item}
                  >
                    {/* Main Navigation Item */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.path}
                        onClick={() => !item.hasDropdown && onClose()}
                        className={`flex-1 text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                          isActiveParent(item)
                            ? "font-bold border-l-4"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{
                          color: isActiveParent(item) ? colors.secondary : "",
                          backgroundColor:
                            isActiveParent(item) ? colors.primaryLight + "40" : "",
                          borderLeftColor:
                            isActiveParent(item) ? colors.secondary : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActiveParent(item)) {
                            e.currentTarget.style.color = colors.secondaryDark;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActiveParent(item)) {
                            e.currentTarget.style.color = "";
                          }
                        }}
                      >
                        {item.name}
                      </Link>

                      {/* Dropdown Toggle Button */}
                      {item.hasDropdown && (
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown(
                              activeDropdown === index ? null : index
                            );
                          }}
                          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                          whileHover={{
                            transform: "translate3d(0px, 0px, 0px) scale(1.1)"
                          }}
                          whileTap={{
                            transform: "translate3d(0px, 0px, 0px) scale(0.9)"
                          }}
                        >
                          <motion.div
                            className="inline-flex items-center justify-center"
                            style={{ transformOrigin: 'center' }}
                            animate={{
                              rotate: activeDropdown === index ? 180 : 0
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                            <ChevronDown size={16} className="text-gray-600" />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>

                    {/* Dropdown Items */}
                    {item.hasDropdown && item.dropdownItems && (
                      <AnimatePresence>
                        {activeDropdown === index && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                              transform: "translate3d(0px, -10px, 0px)"
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transform: "translate3d(0px, 0px, 0px)"
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transform: "translate3d(0px, -10px, 0px)"
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-white"
                          >
                            <motion.div
                              className="ml-4 mt-2 space-y-1"
                              variants={cardVariants.container}
                              initial="initial"
                              animate="animate"
                            >
                              {item.dropdownItems.map((dropdownItem) => (
                                <motion.div
                                  key={dropdownItem.path}
                                  variants={cardVariants.item}
                                >
                                  <Link
                                    to={dropdownItem.path}
                                    onClick={onClose}
                                    className={`block text-sm font-medium py-2 px-4 rounded-md transition-all duration-200 ${
                                      isActiveDropdownItem(dropdownItem.path)
                                        ? "font-bold border-l-2"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                    style={{
                                      color: isActiveDropdownItem(dropdownItem.path)
                                        ? colors.secondary
                                        : "",
                                      backgroundColor:
                                        isActiveDropdownItem(dropdownItem.path)
                                          ? colors.primaryLight + "20"
                                          : "",
                                      borderLeftColor:
                                        isActiveDropdownItem(dropdownItem.path)
                                          ? colors.secondary
                                          : "transparent",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isActiveDropdownItem(dropdownItem.path)) {
                                        e.currentTarget.style.color = colors.secondaryDark;
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isActiveDropdownItem(dropdownItem.path)) {
                                        e.currentTarget.style.color = "";
                                      }
                                    }}
                                  >
                                    {dropdownItem.name}
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                ))}
                {(role === "ADMIN" || role === "SUPERADMIN") && (
                  <motion.div variants={cardVariants.item}>
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className={`flex-1 text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                        location.pathname.startsWith("/admin")
                          ? "font-bold border-l-4"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{
                        color: location.pathname.startsWith("/admin") ? colors.secondary : "",
                        backgroundColor: location.pathname.startsWith("/admin")
                          ? colors.primaryLight + "40"
                          : "",
                        borderLeftColor: location.pathname.startsWith("/admin")
                          ? colors.secondary
                          : "transparent",
                      }}
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>

            {/* Get in Touch Button */}
            <motion.div
              className="px-6 py-6 border-t border-gray-200 flex-shrink-0 bg-white"
              variants={fadeInVariants("up", 0.3)}
              initial="initial"
              animate="animate"
            >
              <motion.div
                whileTap={{ transform: "translate3d(0px, 0px, 0px) scale(0.95)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Link
                  to="/home" // or keep as "/volunteer" depending on your preference
                  className="block w-full text-center text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: colors.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.secondaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.secondary;
                  }}
                  onClick={onClose}
                >
                  Get Enrolled
                </Link>
              </motion.div>
              {/* Logout Button for mobile */}
              <button
                onClick={() => {
                  if (logoutHandler) logoutHandler();
                  onClose();
                }}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                aria-label="Logout"
                type="button"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
