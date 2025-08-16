import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, ChevronDown, LogOut } from "lucide-react"
import MobileMenu from "./MobileMenu"
import CustomButton from "../ui/CustomButton"
import { navLinks, isActiveDropdownPath } from "../../data/navlinks"
import { useTheme } from "../../context/ThemeContext"
import { 
  fadeInVariants,
} from "../../utils/animationVariants"
import { logout as logoutApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
const BASE_URL = import.meta.env.BASE_URL || "/";



const Navbar = () => {
  const { colors } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const location = useLocation()
  const { role } = useAuth();

  // Navbar show/hide on scroll
  const [showNavbar, setShowNavbar] = useState(true)
  const lastScrollY = useRef(window.scrollY)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 10) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false) // scrolling down
      } else {
        setShowNavbar(true) // scrolling up
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes AND scroll to top
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)

    // Scroll to top after navigation completes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }, [location.pathname])

  // Control body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobileMenuOpen])

  // Handler for dropdown toggle
  const toggleDropdown = (index: number | null) => {
    if (activeDropdown === index) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(index)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  // Filter out contact link from navLinks
  const filteredNavLinks = navLinks.filter(link => link.path !== "/contact")

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutApi();
      window.location.replace("https://www.alkemites.com/alkemites/alkem/login.aspx");
    } catch (e) {
      window.location.replace("https://www.alkemites.com/alkemites/alkem/login.aspx");
    }
  };

  return (
    <>
      {/* Sticky Navigation - White background */}
      <motion.header 
        className="sticky top-0 z-40 bg-white shadow-md h-[80px] border-b border-gray-200"
        initial="initial"
        animate={showNavbar ? "animate" : "hidden"}
        variants={{
          initial: { y: 0, opacity: 1 },
          animate: { y: 0, opacity: 1, transition: { duration: 0.25 } },
          hidden: { y: "-100%", opacity: 0, transition: { duration: 0.25 } }
        }}
      >
        <nav className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-10 xl:px-16 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <motion.div 
              className="flex items-center flex-shrink-0"
              variants={fadeInVariants("left", 0.1)}
              initial="initial"
              animate="animate"
              style={{ minWidth: 80 }}
            >
              <Link to="/home" className="flex items-center"> {/* Changed from "/" to "/home" */}
                <img
                  src={`${BASE_URL}logos/alkem_logo.png`}
                  alt="Alkem Logo"
                  className="h-12 w-auto mr-3 sm:h-14 md:h-16 xl:h-16"
                  style={{ minWidth: 64, maxWidth: 180, objectFit: "contain" }}
                  loading="lazy"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation Links - Centered */}
            <motion.div 
              className="hidden lg:flex items-center justify-center flex-1"
              variants={fadeInVariants("none", 0.3)}
              initial="initial"
              animate="animate"
            >
              <div className="flex space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 items-center">
                {filteredNavLinks.map((link: typeof navLinks[0], index: number) => (
                  <motion.div 
                    key={link.path} 
                    className={`relative${index === filteredNavLinks.length - 1 ? " mr-8 xl:mr-12" : ""}`} // Add extra margin after last link
                    variants={fadeInVariants("up", 0.1 * index)}
                    initial="initial"
                    animate="animate"
                  >
                    {link.hasDropdown ? (
                      <div
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(index)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        onClick={e => {
                          e.stopPropagation();
                          setActiveDropdown(index);
                        }}
                      >
                        {/* Dropdown main option is NOT clickable */}
                        <span
                          className="whitespace-nowrap cursor-default relative text-xs md:text-sm lg:text-base tracking-tight flex items-center transition-colors duration-300 font-medium select-none"
                          style={{
                            color: isActiveDropdownPath(
                              location.pathname,
                              link.path,
                              link.dropdownItems
                            )
                              ? colors.secondary
                              : "#374151",
                          }}
                        >
                          {link.name}
                          <motion.div
                            className="ml-1 inline-flex items-center justify-center"
                            style={{ transformOrigin: 'center' }}
                            animate={{ 
                              rotate: activeDropdown === index ? 180 : 0
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronDown size={12} />
                          </motion.div>
                          {/* Underline if any dropdown item is active */}
                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 origin-right"
                            style={{ backgroundColor: colors.secondary }}
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: isActiveDropdownPath(
                                location.pathname,
                                link.path,
                                link.dropdownItems
                              )
                                ? 1
                                : 0,
                            }}
                            transition={{
                              type: "tween",
                              ease: "easeInOut",
                              duration: 0.3,
                            }}
                          />
                        </span>

                        <AnimatePresence>
                          {activeDropdown === index && link.dropdownItems && (
                            <motion.div
                              initial={{ 
                                opacity: 0, 
                                transform: "translate3d(0px, 10px, 0px)" 
                              }}
                              animate={{ 
                                opacity: 1, 
                                transform: "translate3d(0px, 0px, 0px)" 
                              }}
                              exit={{ 
                                opacity: 0, 
                                transform: "translate3d(0px, 10px, 0px)" 
                              }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-0 mt-2 w-44 md:w-52 lg:w-56 xl:w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-100"
                            >
                              {link.dropdownItems.map((item: { path: string; name: string; description?: string }, itemIndex: number) => (
                                <motion.div
                                  key={item.path}
                                  initial={{ 
                                    opacity: 0, 
                                    transform: "translate3d(-10px, 0px, 0px)" 
                                  }}
                                  animate={{ 
                                    opacity: 1,
                                    transform: "translate3d(0px, 0px, 0px)" 
                                  }}
                                  transition={{ delay: itemIndex * 0.05 }}
                                >
                                  <Link
                                    to={item.path}
                                    className={`block px-3 py-2 text-sm transition-colors ${
                                      location.pathname === item.path
                                        ? "font-medium"
                                        : "text-gray-700"
                                    }`}
                                    style={{
                                      color: location.pathname === item.path ? colors.secondary : '',
                                      backgroundColor: location.pathname === item.path ? colors.primaryLight + '40' : 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (location.pathname !== item.path) {
                                        e.currentTarget.style.backgroundColor = colors.primaryLight + '20'
                                        e.currentTarget.style.color = colors.secondaryDark
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (location.pathname !== item.path) {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = '#374151'
                                      }
                                    }}
                                  >
                                    <div>
                                      <div className="font-medium">{item.name}</div>
                                      {item.description && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          {item.description}
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink
                        to={link.path}
                        active={location.pathname === link.path}
                        colors={colors}
                      >
                        <span className="whitespace-nowrap">{link.name}</span>
                      </NavLink>
                    )}
                  </motion.div>
                ))}

                {/* Admin Link - Always visible for ADMIN and SUPERADMIN roles */}
                {(role === "ADMIN" || role === "SUPERADMIN") && (
                  <NavLink to="/admin" active={location.pathname.startsWith("/admin")} colors={colors}>
                    <span className="whitespace-nowrap">Admin</span>
                  </NavLink>
                )}
              </div>
            </motion.div>

            {/* Right Section - CTA Button for Desktop, Menu for Mobile */}
            <div className="flex items-center">
              {/* Desktop CTA Button */}
              <motion.div 
                className="hidden lg:flex items-center"
                variants={fadeInVariants("right", 0.4)}
                initial="initial"
                animate="animate"
              >
                <CustomButton
                  to="/volunteer"
                  variant="secondary"
                  size="md"
                  ariaLabel="Contact us"
                  className="whitespace-nowrap"
                >
                  Get Enrolled
                </CustomButton>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="ml-4 flex cursor-pointer items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  aria-label="Logout"
                  type="button"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div 
                className="lg:hidden flex justify-end items-center flex-shrink-0 ml-2"
                variants={fadeInVariants("right", 0.2)}
                initial="initial"
                animate="animate"
              >
                {!isMobileMenuOpen && (
                  <motion.button
                    className="relative z-40 p-2 rounded-md transition-colors"
                    style={{ 
                      color: colors.secondary,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primaryLight + '20'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                    whileHover={{
                      transform: "translate3d(0px, 0px, 0px) scale(1.05)"
                    }}
                    whileTap={{
                      transform: "translate3d(0px, 0px, 0px) scale(0.95)"
                    }}
                  >
                    <Menu size={26} className="sm:h-7 sm:w-7" />
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            navItems={filteredNavLinks}
            onClose={() => setIsMobileMenuOpen(false)}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            logoutHandler={handleLogout}
            role={role} // <-- add this
          />
        </nav>
      </motion.header>
    </>
  )
}

// Enhanced NavLink component with optimized animations
const NavLink: React.FC<{ 
  to: string
  children: React.ReactNode
  active: boolean
  colors: any
}> = ({ to, children, active, colors }) => {
  // Helper to convert children (string or ReactNode) to sentence case string
  const toSentenceCase = (text: React.ReactNode) => {
    if (typeof text === "string" && text.length > 0) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    return text;
  };

  return (
    <motion.div className="relative" whileHover="hover">
      <Link
        to={to}
        className={`relative text-xs md:text-sm lg:text-base tracking-tight flex items-center transition-colors duration-300 font-medium ${
          active ? "font-bold" : ""
        }`}
        style={{
          color: active ? colors.secondary : '#374151'
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.color = colors.secondaryDark
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.color = '#374151'
          }
        }}
      >
        {toSentenceCase(children)}
      </Link>

      {/* Animated underline with optimized transform */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-0.5 origin-right"
        style={{ backgroundColor: colors.secondary }}
        initial={{ transform: "translate3d(0px, 0px, 0px) scaleX(0)" }}
        animate={{ 
          transform: active 
            ? "translate3d(0px, 0px, 0px) scaleX(1)" 
            : "translate3d(0px, 0px, 0px) scaleX(0)" 
        }}
        variants={{
          hover: {
            transform: "translate3d(0px, 0px, 0px) scaleX(1)",
            transition: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.3,
            },
          },
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.3,
        }}
      />
    </motion.div>
  )
}

export default Navbar