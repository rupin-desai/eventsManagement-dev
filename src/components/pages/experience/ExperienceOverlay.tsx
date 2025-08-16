import {
  X,
  Image as ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInVariants,
  swipeVariants,
} from "../../../utils/animationVariants";
import { useState } from "react";

interface ExperienceOverlayProps {
  open: boolean;
  exp: any | null;
  imageUrl?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
}

export default function ExperienceOverlay({
  open,
  exp,
  imageUrl,
  onClose,
  onPrev,
  onNext,
  showPrev = false,
  showNext = false,
}: ExperienceOverlayProps) {
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  // Handle arrow click to set direction for animation
  const handlePrev = () => {
    setDirection("left");
    onPrev && onPrev();
  };
  const handleNext = () => {
    setDirection("right");
    onNext && onNext();
  };

  if (!open || !exp) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/100"
      initial="initial"
      animate="animate"
      exit="initial"
      variants={fadeInVariants("none", 0)}
    >
      {/* Absolute cross at top right of the page */}
      <motion.button
        className="fixed top-4 right-4 md:top-6 md:right-6 cursor-pointer z-50 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 transition active:scale-95  duration-200"
        onClick={onClose}
        aria-label="Close"
        style={{ pointerEvents: "auto" }}
        initial="initial"
        animate="animate"
        variants={fadeInVariants("down", 0.1)}
      >
        <X className="w-7 h-7" />
      </motion.button>

      {/* Desktop Arrows: left/right center */}
      {showPrev && (
        <motion.button
          className="hidden md:flex fixed left-4 top-1/2 z-50 cursor-pointer -translate-y-1/2 bg-black/60 text-white rounded-full p-2 hover:bg-black/90 transition active:scale-95  duration-200"
          onClick={handlePrev}
          aria-label="Previous"
          style={{ pointerEvents: "auto" }}
          initial="initial"
          animate="animate"
          variants={fadeInVariants("left", 0.15)}
        >
          <ChevronLeft className="w-7 h-7" />
        </motion.button>
      )}
      {showNext && (
        <motion.button
          className="hidden md:flex fixed right-4 top-1/2 z-50 cursor-pointer -translate-y-1/2 bg-black/60 text-white rounded-full p-2 hover:bg-black/90 transition active:scale-95  duration-200"
          onClick={handleNext}
          aria-label="Next"
          style={{ pointerEvents: "auto" }}
          initial="initial"
          animate="animate"
          variants={fadeInVariants("right", 0.15)}
        >
          <ChevronRight className="w-7 h-7" />
        </motion.button>
      )}

      {/* Mobile Arrows: bottom center */}
      {(showPrev || showNext) && (
        <div className="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 gap-8">
          {showPrev && (
            <motion.button
              className="bg-black/60 text-white rounded-full p-3 hover:bg-black/90 transition active:scale-95  duration-200 cursor-pointer"
              onClick={handlePrev}
              aria-label="Previous"
              style={{ pointerEvents: "auto" }}
              initial="initial"
              animate="animate"
              variants={fadeInVariants("left", 0.15)}
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>
          )}
          {showNext && (
            <motion.button
              className="bg-black/60 text-white rounded-full p-3 hover:bg-black/90 transition active:scale-95  duration-200 cursor-pointer"
              onClick={handleNext}
              aria-label="Next"
              style={{ pointerEvents: "auto" }}
              initial="initial"
              animate="animate"
              variants={fadeInVariants("right", 0.15)}
            >
              <ChevronRight className="w-7 h-7" />
            </motion.button>
          )}
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={exp.suggestionId}
            className="flex flex-col md:flex-row w-full h-full"
            custom={direction}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={swipeVariants}
            onAnimationComplete={() => setDirection(null)}
          >
            {/* Left: Large Image */}
            <motion.div
              className="flex-1 bg-black flex items-center justify-center min-w-[200px] max-w-full md:max-w-[60vw] max-h-[50vh] md:max-h-[90vh] relative"
              initial="initial"
              animate="animate"
              exit="initial"
              variants={fadeInVariants("left", 0.18)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={exp.employeeName}
                  className="object-contain w-full h-full max-h-[50vh] md:max-h-[90vh] max-w-full md:max-w-[60vw] bg-black"
                  style={{ background: "#000" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}
            </motion.div>
            {/* Right: Experience Data */}
            <motion.div
              className="flex-1 flex flex-col justify-center items-center relative min-w-[200px] max-w-full md:max-w-[400px] bg-[var(--brand-primary)]/80 overflow-y-auto"
              initial="initial"
              animate="animate"
              exit="initial"
              variants={fadeInVariants("right", 0.22)}
            >
              {/* Date at absolute top right */}
              <div className="absolute top-4 right-6 flex items-center gap-1 text-xs text-[#2B0A3D] font-semibold">
                <Calendar className="w-4 h-4" />
                {new Date(exp.addedOn).toLocaleDateString()}
              </div>
              <div className="flex flex-col items-center justify-center w-full px-4 py-8">
                <div className="text-[#2B0A3D] text-base md:text-lg italic mb-4 text-center">
                  “{exp.description}”
                </div>
                <div className="font-semibold text-lg text-[#2B0A3D] mb-1 text-center">
                  {exp.employeeName &&
                    exp.employeeName
                      .split(" ")
                      .map(
                        (part: string) =>
                          part.charAt(0).toUpperCase() +
                          part.slice(1).toLowerCase()
                      )
                      .join(" ")}
                </div>
                <div className="text-sm text-[#2B0A3D] mb-1 text-center">
                  {exp.employeeDesig}
                </div>
                <div className="text-sm text-blue-700 font-medium mb-2 text-center">
                  {exp.eventName}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
