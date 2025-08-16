import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInVariants, cardVariants, iconVariants } from "../../utils/animationVariants";

// Add base URL for public assets
const BASE_URL = import.meta.env.BASE_URL || "/";

interface AdminNavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: AdminNavItem[];
}

const AdminMobileMenu = ({
  isOpen,
  onClose,
  menuItems,
}: AdminMobileMenuProps) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = () => {
    onClose();
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            initial={{ transform: "translate3d(-100%, 0px, 0px)" }}
            animate={{ transform: "translate3d(0px, 0px, 0px)" }}
            exit={{ transform: "translate3d(-100%, 0px, 0px)" }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="fixed top-0 left-0 h-screen w-80 max-w-[90vw] text-white shadow-2xl z-50 md:hidden flex flex-col"
            style={{ 
              height: '100vh',
              backgroundColor: 'var(--brand-secondary)'
            }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-6 border-b border-red-600 flex-shrink-0"
              variants={fadeInVariants("down", 0.1)}
              initial="initial"
              animate="animate"
            >
              <div className="flex flex-col gap-3">
                <motion.div
                  className="flex items-center gap-3"
                  variants={fadeInVariants("left", 0.2)}
                  initial="initial"
                  animate="animate"
                >
                  {/* Alkem Logo in white container */}
                  <div className="bg-white p-1 rounded-sm shadow-md">
                    <img 
                      src={`${BASE_URL}logos/alkem_logo.png`} 
                      alt="Alkem Logo" 
                      className="h-12 w-full"
                    />
                  </div>
                  {/* SMILE Logo directly on red background */}
                  <img 
                    src={`${BASE_URL}logos/smile_logo_full.png`} 
                    alt="SMILE Logo" 
                    className="h-20 w-auto"
                  />
                </motion.div>
                <motion.div
                  variants={fadeInVariants("left", 0.2)}
                  initial="initial"
                  animate="animate"
                >
                  <p className="text-lg text-white">Smile Admin Panel</p>
                </motion.div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-red-800 transition-colors"
                aria-label="Close menu"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-red-100" />
              </motion.button>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="flex-1 overflow-y-auto px-6 py-4 min-h-0 custom-scrollbar"
              variants={cardVariants.container}
              initial="initial"
              animate="animate"
            >
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.path}
                    variants={cardVariants.item}
                  >
                    <NavLink
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'text-white font-bold'
                            : 'text-red-100 hover:text-white'
                        }`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--brand-secondary-dark)' : 'transparent',
                        borderLeft: isActive ? '4px solid var(--brand-primary)' : '4px solid transparent'
                      })}
                    >
                      <motion.div
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                      >
                        {item.icon}
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="px-6 py-6 border-t border-red-600 flex-shrink-0"
              variants={fadeInVariants("up", 0.3)}
              initial="initial"
              animate="animate"
            >
              <motion.button
                className="flex items-center gap-3 px-4 py-3 text-red-100 hover:text-white rounded-lg transition-colors w-full"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminMobileMenu;