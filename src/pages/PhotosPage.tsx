import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, X as LucideX, ChevronLeft, ChevronRight } from "lucide-react";
import { getGallery } from "../api/galleryApi";
import { getActivityById } from "../api/activityApi";
import { textVariants, fadeInVariants } from "../utils/animationVariants";

// --- Carousel Overlay Modal ---
const CarouselOverlay: React.FC<{
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}> = ({ images, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);

  const goPrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [current, images.length]);

  // Prevent scroll/propagation on overlay
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex flex-col items-center w-full h-full"
        initial={{ scale: 0.98, opacity: 0.98 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.18 } }}
        exit={{ scale: 0.98, opacity: 0.98, transition: { duration: 0.15 } }}
        onClick={stopPropagation}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-white z-10 bg-white/40 rounded-full p-2 hover:bg-white/70 transition-colors cursor-pointer active:scale-95 transition-transform duration-200"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <LucideX className="w-7 h-7" />
        </button>
        {/* Carousel Buttons absolute left/right for desktop */}
        <button
          className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer active:scale-95 transition-transform duration-200"
          onClick={goPrev}
          aria-label="Previous"
          type="button"
          tabIndex={-1}
        >
          <span className="bg-white/40 hover:bg-white/50 rounded-full p-3 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-8 h-8 text-white" />
          </span>
        </button>
        <div className="flex items-center justify-center w-full h-full relative">
          <img
            src={images[current].imageUrl}
            alt={images[current].title || "Gallery Image"}
            className="object-contain max-h-[70vh] max-w-[90vw] rounded-lg"
            style={{ background: "#f3f4f6" }}
            draggable={false}
          />
        </div>
        <button
          className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer active:scale-95 transition-transform duration-200"
          onClick={goNext}
          aria-label="Next"
          type="button"
          tabIndex={-1}
        >
          <span className="bg-white/40 hover:bg-white/50 rounded-full p-3 flex items-center justify-center transition-colors">
            <ChevronRight className="w-8 h-8 text-white" />
          </span>
        </button>
        {/* Mobile Arrows at bottom center */}
        <div className="flex sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 gap-8">
          <button
            className="bg-white/40 hover:bg-white/50 rounded-full p-3 flex items-center justify-center transition-colors cursor-pointer active:scale-95 transition-transform duration-200"
            onClick={goPrev}
            aria-label="Previous"
            type="button"
            tabIndex={-1}
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <button
            className="bg-white/40 hover:bg-white/50 rounded-full p-3 flex items-center justify-center transition-colors cursor-pointer active:scale-95 transition-transform duration-200"
            onClick={goNext}
            aria-label="Next"
            type="button"
            tabIndex={-1}
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
        </div>
        <div className="mt-4 text-white text-center">
          <div className="text-xs opacity-80">
            {current + 1} / {images.length}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface GalleryImage {
  id: number;
  imageUrl: string;
  activityId: number | null;
  title: string;
  status?: string;
}

interface ActivityTitleMap {
  [activityId: number]: string;
}

const BASE_URL = import.meta.env.BASE_URL || "/";

const PhotosPage: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [groupedImages, setGroupedImages] = useState<Record<number | string, GalleryImage[]>>({});
  const [activityTitles, setActivityTitles] = useState<ActivityTitleMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carousel overlay state
  const [carouselImages, setCarouselImages] = useState<GalleryImage[] | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Helper function to check if a file path is an image
  const isImageFile = (filePath: string) => {
    if (!filePath) return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filePath);
  };

  // Fetch gallery images and group by activityId
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await getGallery();
        // Only keep images with status === "N" and valid image extension
        const images = response.data
          .filter(
            (image: any) =>
              image.status === "N" && isImageFile(image.filePath)
          )
          .map((image: any) => ({
            id: image.id || Math.random(),
            imageUrl: image.filePath || "",
            activityId: image.activityId || null,
            title: image.title || "Untitled",
            status: image.status,
          }));
        setGalleryImages(images);

        // Group images by activityId
        const grouped = images.reduce(
          (acc: Record<number | string, GalleryImage[]>, img: GalleryImage) => {
            const key = img.activityId || "Uncategorized";
            if (!acc[key]) acc[key] = [];
            acc[key].push(img);
            return acc;
          },
          {} as Record<number | string, GalleryImage[]>
        );

        setGroupedImages(grouped);

        // Fetch activity titles for all unique activityIds (except null/"Uncategorized")
        const uniqueActivityIds = [
          ...new Set(images.map((img: GalleryImage) => img.activityId).filter((id: number | null): id is number => id !== null)),
        ] as number[];

        const titleMap: ActivityTitleMap = {};
        await Promise.all(
          uniqueActivityIds.map(async (activityId) => {
            try {
              const res = await getActivityById(activityId);
              titleMap[activityId] = res.data?.name?.trim() || `Activity ID: ${activityId}`;
            } catch {
              titleMap[activityId] = `Activity ID: ${activityId}`;
            }
          })
        );
        setActivityTitles(titleMap);
      } catch (err) {
        setError("Failed to fetch gallery images.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Skeleton component for image loading
  const ImageSkeleton: React.FC = () => (
    <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-lg overflow-hidden flex items-center justify-center">
      <div className="w-2/3 h-5 bg-gray-300 rounded mb-2 animate-pulse" />
      <div className="w-1/2 h-5 bg-gray-300 rounded animate-pulse" />
    </div>
  );

  // Place this inside PhotosPage.tsx or in a separate file if you prefer
  const ImageCard: React.FC<{
    img: GalleryImage;
    filteredImages: GalleryImage[];
    activityId: string | number;
    activityTitles: ActivityTitleMap;
    setCarouselImages: (imgs: GalleryImage[]) => void;
    setCarouselIndex: (idx: number) => void;
    BASE_URL: string;
  }> = ({
    img,
    filteredImages,
    activityId,
    activityTitles,
    setCarouselImages,
    setCarouselIndex,
    BASE_URL,
  }) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
      <div
        className="group relative flex flex-col items-center mb-6 w-full"
        style={{
          aspectRatio: "3/2",
          maxWidth: 400,
          minWidth: 0,
          minHeight: 0,
          width: "100%",
          height: "auto",
          cursor: "pointer",
        }}
      >
        <div
          className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden w-full h-full relative"
          onClick={() => {
            setCarouselImages(filteredImages);
            setCarouselIndex(filteredImages.findIndex((i: GalleryImage) => i.id === img.id));
          }}
          style={{ height: 0, paddingBottom: "66.66%" }} // 3:2 aspect ratio
        >
          {/* Skeleton while loading */}
          {!imgLoaded && <ImageSkeleton />}
          <img
            src={img.imageUrl}
            alt={img.title || "Gallery Image"}
            className={`object-contain absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ maxHeight: 300, maxWidth: "100%" }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.endsWith("smile_logo.png")) {
                target.src = `${BASE_URL}logos/smile_logo.png`;
              }
              setImgLoaded(true);
            }}
          />
          {/* Lucide Eye icon animation */}
          <span
            className="absolute bottom-2 right-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
            style={{ pointerEvents: "none" }}
          >
            <Eye className="h-6 w-6 text-gray-700 bg-white/80 rounded-full p-1 shadow" />
          </span>
        </div>
        {/* Event title below image */}
        <h2 className="text-lg font-medium text-gray-700 mt-4 mb-6 text-center w-full">
          {activityId === "Uncategorized"
            ? "Other Photos"
            : activityTitles[Number(activityId)] || `Activity ID: ${activityId}`}
        </h2>
      </div>
    );
  };

  return (
    <>
      <title>Photo Gallery | Alkem Smile Volunteering</title>
      <meta name="description" content="Browse photos from Alkem Smile volunteering events and activities. See our employees in action making a difference." />
      <meta name="keywords" content="alkem, photo gallery, volunteering, events, community, smile, photos" />
      <div className="min-h-screen bg-white flex flex-col items-center justify-start py-10">
        {/* Title Section */}
        <motion.div
          className="flex flex-col items-center mb-2 relative"
          variants={textVariants.header}
          initial="initial"
          animate="animate"
        >
          {/* Subtitle with dash */}
          <motion.div 
            className="flex items-center gap-3 mb-2"
            variants={fadeInVariants("up", 0.2)}
            initial="initial"
            animate="animate"
          >
            <div className="w-8 h-0.5 bg-yellow-400" />
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Our Photos
            </span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-black text-center whitespace-nowrap relative mb-2"
            variants={textVariants.title}
            initial="initial"
            animate="animate"
          >
            Photo Gallery
            {/* Underline SVG */}
            <motion.img
              src={`${import.meta.env.BASE_URL}graphics/smile_underline.svg`}
              alt="underline"
              className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[120px] h-auto"
              style={{ pointerEvents: "none" }}
              variants={fadeInVariants("up", 0.6)}
              initial="initial"
              animate="animate"
            />
          </motion.h1>
          
          {/* Description */}
          <motion.div 
            className="text-base text-gray-700 mt-8 mb-8 max-w-2xl text-center"
            variants={textVariants.description}
            initial="initial"
            animate="animate"
          >
            A glimpse into moments that reflect compassion, commitment, and community impact.
          </motion.div>
        </motion.div>

        {/* Gallery Section */}
        {loading ? (
          <motion.div
            className="flex items-center justify-center"
            variants={fadeInVariants("up", 0.2)}
            initial="initial"
            animate="animate"
          >
            <div className="text-gray-500">Loading gallery images...</div>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-red-500"
            variants={fadeInVariants("up", 0.2)}
            initial="initial"
            animate="animate"
          >
            {error}
          </motion.div>
        ) : galleryImages.length === 0 ? (
          <motion.div
            className="text-gray-500"
            variants={fadeInVariants("up", 0.2)}
            initial="initial"
            animate="animate"
          >
            No images available in the gallery.
          </motion.div>
        ) : (
          // --- Show 3 events in a row ---
          (() => {
            // Prepare an array of event "cards", each with max 1 image
            const eventCards = Object.entries(groupedImages).map(([activityId, images]) => {
              const filteredImages = images.filter((img) => img.status === "N");
              const imagesToShow = filteredImages.slice(0, 1);
              return (
                <div key={activityId} className="flex flex-col items-center w-full max-w-xs">
                  <motion.div
                    className="w-full flex flex-col items-center"
                    variants={fadeInVariants("up", 0.2)}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="flex justify-center w-full">
                      {imagesToShow.map((img: GalleryImage) => (
                        <ImageCard
                          key={img.id}
                          img={img}
                          filteredImages={filteredImages}
                          activityId={activityId}
                          activityTitles={activityTitles}
                          setCarouselImages={setCarouselImages}
                          setCarouselIndex={setCarouselIndex}
                          BASE_URL={BASE_URL}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            });

            // Chunk eventCards into rows of 3
            const rows = [];
            for (let i = 0; i < eventCards.length; i += 3) {
              rows.push(eventCards.slice(i, i + 3));
            }

            return rows.map((row, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-8 w-full justify-center mb-10">
                {row}
              </div>
            ));
          })()
        )}

        {/* Carousel Overlay */}
        {carouselImages && (
          <CarouselOverlay
            images={carouselImages}
            initialIndex={carouselIndex}
            onClose={() => setCarouselImages(null)}
          />
        )}
      </div>
    </>
  );
};

export default PhotosPage;