import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Linkedin, ChevronRight, Globe, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  sectionVariants,
  cardVariants,
  fadeInVariants,
} from "../../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";

const Footer = () => {
  const { colors } = useTheme();
  const year = new Date().getFullYear();
  const location = useLocation();

  // Effect to scroll to top after navigation completes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // Social media links - only website and LinkedIn
  const socialLinks = [
    {
      name: "Website",
      url: "https://www.alkemlabs.com/sustainability/csr",
      icon: <Globe size={20} />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/alkem-foundation-india/",
      icon: <Linkedin size={20} />,
    },
  ];

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/home" }, // Changed from "/" to "/home"
        { name: "About Us", path: "/about" },
        { name: "Volunteer", path: "/volunteer" },
        { name: "We Care Month", path: "/we-care-month" },
        { name: "Achievements", path: "/achievements" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Media & Resources",
      links: [
        { name: "Video Gallery", path: "/videos" },
        { name: "Photo Gallery", path: "/photos" },
        { name: "Experience Hub", path: "/experience" },
        {
          name: "User Manual",
          path: `${BASE_URL}Manuals/Alkem Smile User Manual.pdf`,
          isManual: true,
        },
      ],
    },
    {
      title: "Contact Us",
      isContact: true,
      contactInfo: {
        email: "csr@alkem.com",
      },
    },
  ];

  return (
    <motion.footer
      className="py-6 md:pt-12 px-6 md:px-10 text-sm md:text-base text-white overflow-hidden"
      style={{ backgroundColor: colors.secondary }}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-2 md:mb-0"
          variants={cardVariants.container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Logo and Description */}
          <motion.div
            className="space-y-1 col-span-1 flex flex-col items-center md:items-start"
            variants={cardVariants.item}
          >
            <motion.div
              variants={fadeInVariants("up", 0.1)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Link to="/" className="flex justify-center md:justify-start">
                <img
                  src={`${BASE_URL}logos/smile_logo_full.png`}
                  alt="Alkem Smile Logo"
                  className="h-24 md:h-28 w-auto"
                />
              </Link>
            </motion.div>

            {/* Description */}
            <motion.p
              className="mt-4 text-sm max-w-xs text-center md:text-left text-justify"
              style={{ color: colors.primaryLight }}
              variants={fadeInVariants("up", 0.2)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              SMILE is Alkem Foundation's flagship employee volunteering
              initiative, inspiring Alkemites to contribute meaningfully to
              society.
            </motion.p>

            {/* Social Icons */}
            <motion.div
              className="flex space-x-4 mt-4"
              variants={cardVariants.container}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  className="transition-colors p-2 rounded-full"
                  style={{
                    color: colors.primaryLight,
                    backgroundColor: colors.secondaryDark,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = colors.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.secondaryDark;
                    e.currentTarget.style.color = colors.primaryLight;
                  }}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={cardVariants.item}
                  whileHover={{
                    transform: "translate3d(0px, -2px, 0px) scale(1.1)",
                  }}
                  whileTap={{
                    transform: "translate3d(0px, 0px, 0px) scale(0.95)",
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer Links Sections */}
          <motion.div
            className="col-span-1 md:col-span-3"
            variants={cardVariants.item}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {footerLinks.map((section, index) => (
                <div
                  key={index}
                  className={`space-y-4 text-left ${
                    section.isContact
                      ? "col-span-2 md:col-span-1 flex flex-col items-center md:items-start"
                      : ""
                  }`}
                >
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white inline-block pb-2">
                      {section.title}
                    </h3>
                    <div
                      className="w-16 h-0.5 mt-1"
                      style={{ backgroundColor: colors.primary }}
                    ></div>
                  </div>
                  {/* Contact Section */}
                  {section.isContact ? (
                    <div className="space-y-3">
                      {/* Email only */}
                      <div className="flex items-center">
                        <Mail
                          size={14}
                          className="mr-2 flex-shrink-0"
                          style={{ color: colors.primaryLight }}
                        />
                        <div>
                          <span
                            className="mr-1"
                            style={{ color: colors.primaryLight }}
                          >
                            Email:
                          </span>
                          <a
                            href={`mailto:${section.contactInfo.email}`}
                            className="transition-all hover:underline"
                            style={{ color: colors.primaryLight }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = colors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = colors.primaryLight;
                            }}
                          >
                            {section.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular Links Section */
                    <ul className="space-y-2">
                      {section.links?.map((link, i) => (
                        <li key={i} className="text-left">
                          {link.isManual ? (
                            <a
                              href={link.path}
                              download
                              className="transition-all hover:underline flex items-center text-sm"
                              style={{ color: colors.primaryLight }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.primaryLight;
                              }}
                            >
                              <FileText
                                size={16}
                                className="mr-1.5 flex-shrink-0"
                                style={{ color: colors.primary }}
                              />
                              <span>{link.name}</span>
                            </a>
                          ) : (
                            <Link
                              to={link.path}
                              className="transition-all hover:underline flex items-center text-sm"
                              style={{ color: colors.primaryLight }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.primaryLight;
                              }}
                            >
                              <ChevronRight
                                size={14}
                                className="mr-1.5 flex-shrink-0"
                                style={{ color: colors.primary }}
                              />
                              <span>{link.name}</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Spacer for layout on desktop, hidden on mobile */}
          <div className="hidden md:block" />
        </motion.div>

        {/* Copyright and Credits */}
        {/* Desktop: copyright above divider and right-aligned */}
        <motion.div
          className="hidden md:flex justify-end items-center mb-4"
          variants={fadeInVariants("up", 0.5)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <span
            className="text-xs md:text-sm"
            style={{ color: colors.primaryLight }}
          >
            &copy; {year} Alkem Smile. All rights reserved.
          </span>
        </motion.div>
        <motion.div
          className="border-t pt-6 overflow-hidden"
          style={{ borderTopColor: colors.secondaryDark }}
          variants={fadeInVariants("up", 0.5)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Centered Initiative By (logo) */}
          <div className="w-full flex justify-center mt-3 md:mt-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span
                className="text-sm md:text-md font-normal"
                style={{ color: colors.primaryLight }}
              >
                An Initiative By
              </span>
              <span className="bg-white rounded-md p-1 flex items-center justify-center">
                <img
                  src={`${BASE_URL}logos/alkem_logo.png`}
                  alt="Alkem Foundation"
                  className="h-10 md:h-16 w-auto"
                  style={{ minWidth: 28 }}
                  loading="lazy"
                />
              </span>
            </div>
          </div>
          {/* Mobile: copyright below divider and centered */}
          <div className="flex md:hidden justify-center mt-4">
            <span
              className="text-xs text-center"
              style={{ color: colors.primaryLight }}
            >
              &copy; {year} Alkem Smile. All rights reserved.
            </span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
