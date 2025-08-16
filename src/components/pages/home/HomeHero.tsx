import { motion } from "framer-motion";
import { cardVariants } from "../../../utils/animationVariants";
import { textVariants } from "../../../utils/animationVariants";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // <-- Add this import

// Import base URL from Vite config
const BASE_URL = import.meta.env.BASE_URL || "/";

// --- CustomCTAButton (inline, copied from your component) ---
interface CustomCTAButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  iconSize?: number;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "dark" | "primary";
  size?: "xs" | "sm" | "md" | "lg";
}

const CustomCTAButton: React.FC<CustomCTAButtonProps> = ({
  children,
  to,
  onClick,
  iconSize = 16,
  className = "",
  disabled = false,
  variant = "default",
  size = "md",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles =
    "font-medium rounded-full relative transition-colors duration-200 w-full";

  const variants = {
    default: "bg-white text-black hover:bg-gray-100 focus:bg-gray-100",
    dark: "bg-black text-white hover:bg-gray-800 focus:bg-gray-800",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
  };

  const sizes = {
    xs: "text-[10px] px-2 py-1 pr-7",
    sm: "text-xs px-4 py-2 pr-10",
    md: "text-xs px-5 py-2.5 pr-12",
    lg: "text-sm px-6 py-3 pr-14",
  };

  const iconSizes = {
    xs: iconSize || 10,
    sm: iconSize || 12,
    md: iconSize || 16,
    lg: iconSize || 20,
  };

  const iconCircleSizes = {
    xs: "w-5 h-5 right-0.5",
    sm: "w-6 h-6 right-1",
    md: "w-7 h-7 right-1.5",
    lg: "w-8 h-8 right-2",
  };

  const iconWrapperStyles =
    variant === "default"
      ? "bg-black text-white"
      : variant === "dark"
      ? "bg-white text-black"
      : "bg-white text-blue-600";

  const buttonContent = (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      type="button"
    >
      <span className="text-left block">{children}</span>
      <motion.div
        className={`${iconCircleSizes[size]} ${iconWrapperStyles} rounded-full flex items-center justify-center absolute top-1/2 transform -translate-y-1/2`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{
            rotate: isHovered ? 360 : 300,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <ArrowRight size={iconSizes[size]} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </button>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className="inline-block w-full">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};
// --- End CustomCTAButton ---

const HomeHero = () => {
  return (
    <motion.section
      className="relative lg:min-h-screen py-16 md:py-36 overflow-hidden flex items-center justify-center"
      initial="initial"
      animate="animate"
      variants={cardVariants.container}
    >
      {/* SVG Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url("${BASE_URL}graphics/line_full_1.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          opacity: 0.5,
        }}
      ></div>

      {/* Centered Section Title */}
      <motion.div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <motion.img
          src={`${BASE_URL}logos/smile_logo_full.png`}
          alt="SMILE"
          className="h-20 md:h-48 lg:h-64 mb-2 hidden md:block" // <-- hide on mobile
          style={{ objectFit: "contain" }}
          variants={textVariants.header}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Mobile Grid (visible below md) */}
      <motion.div
        className="relative z-10 w-full block md:hidden"
        variants={cardVariants.container}
        initial="initial"
        animate="animate"
      >
        <div
          className="grid grid-cols-2 gap-4 px-4 mx-auto max-w-xs sm:max-w-sm"
          style={{ maxWidth: "100%", width: "100%" }}
        >
          {/* Row 1 */}
          <div className="col-span-1">
            <div
              className="rounded-xl shadow-lg flex flex-col h-full justify-between p-0 overflow-hidden min-h-[140px]"
              style={{ backgroundColor: "#c53030" }}
            >
              <div className="w-full flex justify-center items-center px-3 py-2">
                <span className="text-white text-lg font-bold">Gallery</span>
              </div>
              <div className="w-full flex justify-center px-3">
                <img
                  src={`${BASE_URL}images/homePage/Hero3.JPG`}
                  alt="Gallery Thumbnail"
                  className="object-cover rounded-2xl h-24 mb-3 w-full"
                  style={{ maxHeight: 120 }}
                />
              </div>
              <div className="w-full flex justify-end px-3 pb-3">
                <CustomCTAButton to="/photos" size="sm" variant="default">
                  View Gallery
                </CustomCTAButton>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="rounded-xl shadow-lg overflow-hidden h-full min-h-[140px] flex flex-col justify-end bg-gray-300 relative">
              <img
                src={`${BASE_URL}images/homePage/image1.jpeg`}
                alt="Strengthen community bond"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />
              {/* Black overlay filter */}
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="relative z-20 p-3">
                <span className="text-white font-semibold text-base">
                  Strengthen
                  <br />
                  community bond
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="col-span-2">
            <div className="rounded-2xl shadow-lg flex flex-col items-center justify-center py-6 px-4" style={{ backgroundColor: "#c53030" }}>
              {/* Smile logo above the text */}
              <img
                src={`${BASE_URL}logos/smile_logo_full.png`}
                alt="Smile Logo"
                className="h-28 w-auto mb-2"
                style={{ objectFit: "contain" }}
              />
              <div className="text-white text-lg font-bold mb-3 text-center">
                10K + Volunteered 2024-25
              </div>
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[150px]">
                  <CustomCTAButton to="/volunteer" size="sm" variant="default">
                    Join as volunteer
                  </CustomCTAButton>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="col-span-1">
            <div className="rounded-xl shadow-lg overflow-hidden h-full min-h-[140px] flex flex-col justify-end bg-gray-300 relative">
              <img
                src={`${BASE_URL}images/homePage/Hero2.jpg`}
                alt="Engage with meaningful causes"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "left" }}
              />
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="relative z-10 p-3">
                <span className="text-white font-semibold text-base">
                  Engage with
                  <br />
                  meaningful causes
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="rounded-xl bg-yellow-500 shadow-lg flex flex-col h-full justify-between p-0 overflow-hidden min-h-[140px]">
              <div className="w-full flex justify-center items-center px-3 py-2">
                <span className="text-white text-lg font-bold">Videos</span>
              </div>
              <div className="w-full flex justify-center px-3">
                <img
                  src={`${BASE_URL}images/image4.webp`}
                  alt="Gallery Thumbnail"
                  className="object-cover rounded-2xl h-24 mb-3 w-full"
                  style={{ maxHeight: 120 }}
                />
              </div>
              <div className="w-full flex justify-end px-3 pb-3">
                <CustomCTAButton to="/photos" size="sm" variant="default">
                  View Videos
                </CustomCTAButton>
              </div>
            </div>
          </div>
          {/* Removed Spread the Love and Home for Maternal Help cards */}
        </div>
      </motion.div>

      {/* Responsive Grid (md and up) */}
      <motion.div
        className="relative z-10 w-full hidden md:block"
        variants={cardVariants.container}
        initial="initial"
        animate="animate"
      >
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-5
            lg:grid-cols-5
            gap-2 md:gap-2 lg:gap-4
            px-2
            sm:px-4
            md:px-6
            lg:px-24
            xl:px-36
            mx-auto
            max-w-[700px] md:max-w-[900px] lg:max-w-[1400px]
          "
        >
          {/* Column 1 */}
          <motion.div
            className="col-span-1 flex flex-col h-full justify-end"
            variants={cardVariants.item}
          >
            {/* 1st square */}
            <div
              className="
              relative rounded-lg flex items-center justify-center overflow-hidden w-full
              min-h-[100px] md:min-h-[140px] lg:min-h-[180px]
              max-h-[120px] md:max-h-[180px] lg:max-h-[260px]
            "
            >
              <img
                src={`${BASE_URL}graphics/YELLOW_STRIP_SHAPE.svg`}
                alt="Yellow folder"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 md:pb-4 lg:pb-6 px-1 md:px-2">
                <div
                  className="
                  relative flex items-center justify-center
                  w-16 h-16 md:w-24 md:h-24 lg:w-34 lg:h-32
                  mb-3 md:mb-2 lg:mb-6
                "
                >
                  <img
                    src={`${BASE_URL}images/image4.webp`}
                    alt="Videos"
                    className="w-16 h-16 md:w-24 md:h-24 lg:w-34 lg:h-32 object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div className="w-full flex justify-center">
                  {/* xs/sm screens */}
                  <div className="block md:hidden w-full">
                    <CustomCTAButton to="/videos" size="sm" variant="default">
                      View Videos
                    </CustomCTAButton>
                  </div>
                  {/* md screens */}
                  <div
                    className="hidden md:block lg:hidden"
                    style={{ width: "90px" }}
                  >
                    <CustomCTAButton to="/videos" size="xs" variant="default">
                      Videos
                    </CustomCTAButton>
                  </div>
                  {/* lg+ screens */}
                  <div className="hidden lg:block" style={{ width: "140px" }}>
                    <CustomCTAButton to="/videos" size="sm" variant="default">
                      View Videos
                    </CustomCTAButton>
                  </div>
                </div>
              </div>
            </div>
            {/* 2nd square */}
            <div
              className="
    md:rounded-2xl lg:rounded-4xl flex items-center justify-center text-white font-semibold shadow-lg
    px-2 md:mx-3 lg:px-20
    py-4 md:py-6 lg:py-12
    min-h-[40px] md:min-h-[60px] lg:min-h-[80px]
    max-h-[50px] md:max-h-[90px] lg:max-h-[160px]
    mt-2 md:mt-3 lg:mt-4
  "
              style={{ backgroundColor: "#ef4444" }}
            >
              <div className="flex items-center justify-center">
                <img
                  src={`${BASE_URL}graphics/SMILE.svg`}
                  alt="SMILE"
                  className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 mr-1 flex-shrink-0"
                />
              </div>
              <span className="text-base md:text-lg hidden lg:block text-left ml-2 whitespace-nowrap">
                SPREAD
                <br /> THE SMILE
              </span>
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            className="col-span-1 flex flex-col h-full justify-end"
            variants={cardVariants.item}
          >
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="
                  relative rounded-4xl w-full h-full flex items-end justify-center shadow-lg overflow-hidden
                  min-h-[100px] md:min-h-[140px] lg:min-h-[180px]
                  max-h-[120px] md:max-h-[200px] lg:max-h-[260px]
                "
                style={{
                  backgroundImage: `url("${BASE_URL}images/homePage/image2.jpeg")`,
                  backgroundSize: "cover",
                  backgroundPosition: "33% center",
                }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <span className="relative z-10 text-base md:text-lg text-white text-left font-semibold text-center pb-3 md:pb-4 lg:pb-6 px-2 md:px-3 lg:px-4 w-full">
                  Strengthen community bonds
                </span>
              </div>
            </div>
          </motion.div>

          {/* Column 3 */}
          <motion.div
            className="col-span-1 flex items-end justify-center"
            variants={cardVariants.item}
          >
            <div
              className="
                rounded-3xl flex flex-col justify-between text-white font-semibold shadow-lg
                p-2 md:p-3 lg:p-4 w-full
                min-h-[50px] md:min-h-[70px] lg:min-h-[120px]
                max-h-[60px] md:max-h-[150px] lg:max-h-[180px]
              "
              style={{
                backgroundColor: "#c53030",
              }}
            >
              <div className="text-center">
                <div className="text-lg md:text-lg lg:text-2xl font-bold leading-tight">
                  10K + Volunteered 2024-25
                </div>
              </div>
              <div className="flex justify-center mt-2 md:mt-3 lg:mt-4">
                <CustomCTAButton to="/volunteer" variant="default" size="md">
                  Volunteer
                </CustomCTAButton>
              </div>
            </div>
          </motion.div>

          {/* Column 4 */}
          <motion.div
            className="col-span-1 flex items-end"
            variants={cardVariants.item}
          >
            <div
              className="
                relative rounded-4xl w-full h-full flex items-end justify-center shadow-lg overflow-hidden
                min-h-[100px] md:min-h-[140px] lg:min-h-[180px]
                max-h-[120px] md:max-h-[200px] lg:max-h-[260px]
              "
              style={{
                backgroundImage: `url("${BASE_URL}images/homePage/Hero2.jpg")`,
                backgroundSize: "cover",
                backgroundPosition: "20% center",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <span className="relative z-10 text-base md:text-lg text-white text-right font-semibold text-center pb-3 md:pb-4 lg:pb-6 px-2 md:px-3 lg:px-4 w-full">
                Engage with meaningful causes
              </span>
            </div>
          </motion.div>

          {/* Column 5 */}
          <motion.div
            className="col-span-1 flex flex-col h-full justify-end"
            variants={cardVariants.item}
          >
            {/* 1st square */}
            <div
              className="
      relative rounded-lg flex items-center justify-center overflow-hidden w-full
      min-h-[100px] md:min-h-[140px] lg:min-h-[180px]
      max-h-[120px] md:max-h-[180px] lg:max-h-[260px]
    "
            >
              <img
                src={`${BASE_URL}graphics/red_folder_1.svg`}
                alt="Red folder"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex flex-col justify-between items-center p-2 md:p-3 lg:p-4">
                <div className="w-full flex justify-center mt-3 md:mt-4 lg:mt-8">
                  <span className="text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow">
                    Gallery
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <img
                    src={`${BASE_URL}images/homePage/Hero3.JPG`}
                    alt="Gallery Thumbnail"
                    className="object-cover rounded-2xl md:h-16 lg:h-24"
                  />
                </div>
                <div className="w-full flex justify-center">
                  {/* xs/sm screens */}
                  <div className="block md:hidden w-full">
                    <CustomCTAButton to="/photos" size="sm" variant="default">
                      View Gallery
                    </CustomCTAButton>
                  </div>
                  {/* md screens */}
                  <div
                    className="hidden md:block lg:hidden"
                    style={{ width: "90px" }}
                  >
                    <CustomCTAButton to="/photos" size="xs" variant="default">
                      Photos
                    </CustomCTAButton>
                  </div>
                  {/* lg+ screens */}
                  <div className="hidden lg:block" style={{ width: "140px" }}>
                    <CustomCTAButton to="/photos" size="sm" variant="default">
                      View Gallery
                    </CustomCTAButton>
                  </div>
                </div>
              </div>
            </div>
            {/* 2nd square */}
            <div
              className="
      md:rounded-2xl lg:rounded-4xl flex items-center justify-center text-white font-semibold shadow-lg
      px-2 md:mx-3 lg:px-20
      py-4 md:py-6 lg:py-12
      min-h-[40px] md:min-h-[85px] lg:min-h-[150px]
      max-h-[50px] md:max-h-[90px] lg:max-h-[160px]
      mt-2 md:mt-3 lg:mt-4
    "
              style={{
                backgroundColor: "#fbbf24",
                backgroundImage: `url("${BASE_URL}images/homePage/image1.jpeg")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "20% center",
              }}
            ></div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HomeHero;
