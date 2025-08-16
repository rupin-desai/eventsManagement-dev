import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { textVariants } from "../utils/animationVariants";
import { getGallery } from "../api/galleryApi";

const BASE_URL = import.meta.env.BASE_URL || "/";

// Helper to check for video file extensions
const isVideoFile = (filePath: string) => {
	if (!filePath) return false;
	return /\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i.test(filePath);
};

const VideoPlayerModal = ({
	url,
	alt,
	open,
	onClose,
}: {
	url: string;
	alt: string;
	open: boolean;
	onClose: () => void;
}) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
			<div className="relative w-full max-w-3xl mx-4">
				<button
					className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow"
					onClick={onClose}
					aria-label="Close"
				>
					✕
				</button>
				<video
					className="w-full h-auto rounded-xl shadow-lg bg-black"
					src={url}
					controls
					autoPlay
					title={alt}
				/>
			</div>
		</div>
	);
};

const VideosPage = () => {
	const [modal, setModal] = useState<{
		open: boolean;
		url: string;
		alt: string;
	}>({
		open: false,
		url: "",
		alt: "",
	});

	const [videos, setVideos] = useState<
		{
			id: number;
			vidPath: string;
			thumbnailPath: string;
			desc: string;
		}[]
	>([]);

	useEffect(() => {
		getGallery().then((res) => {
			const data = Array.isArray(res.data) ? res.data : [];
			const filtered = data
				.filter(
					(item) =>
						item.status === "N" && isVideoFile(item.filePath)
				)
				.map((item) => ({
					id: item.id,
					vidPath: item.filePath,
					thumbnailPath: item.thumbFilePath || "",
					desc: item.description || "",
				}));
			setVideos(filtered);
		});
	}, []);

	return (
		<>
			<title>Video Gallery | Alkem Smile Volunteering</title>
			<meta
				name="description"
				content="Watch videos from Alkem Smile volunteering events and activities. Get inspired by our employees' community impact."
			/>
			<meta
				name="keywords"
				content="alkem, video gallery, volunteering, events, community, smile, videos"
			/>
			<div className=" bg-white flex flex-col items-center justify-center py-10">
				{/* Section dash and subtitle */}
				<motion.div
					className="flex flex-col items-center mb-2 relative"
					variants={textVariants.header}
					initial="initial"
					animate="animate"
				>
					<div className="flex items-center gap-3 mb-2">
						<div className="w-8 h-0.5 bg-yellow-400" />
						<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Our Videos
						</span>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-black text-center whitespace-nowrap relative mb-2">
						Video Gallery
						<img
							src={`${BASE_URL}graphics/smile_underline.svg`}
							alt="underline"
							className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[120px] h-auto"
							style={{ pointerEvents: "none" }}
						/>
					</h1>
					<div className="text-base text-gray-700 mt-8 mb-8 max-w-2xl text-center">
						From the heart of our volunteers to the communities we serve -
						experience the journey.
					</div>
				</motion.div>
				{/* Videos Grid */}
				<div className="w-full flex justify-center">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
						{videos.map((video) => (
							<div
								key={video.id}
								className="flex flex-col items-center max-w-md w-full mx-auto"
							>
								{/* Thumbnail with play button */}
								<div
									className="relative w-full aspect-video rounded-xl shadow-lg bg-black overflow-hidden group cursor-pointer transition-all"
									onClick={() =>
										setModal({
											open: true,
											url: video.vidPath,
											alt: video.desc,
										})
									}
									tabIndex={0}
									role="button"
									aria-label={`Play video`}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ")
											setModal({
												open: true,
												url: video.vidPath,
												alt: video.desc,
											});
									}}
								>
									<img
										src={video.thumbnailPath}
										alt={video.desc}
										className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
										draggable={false}
									/>
									<div className="absolute inset-0 flex items-center justify-center">
										<PlayCircle
											className="w-20 h-20 text-white drop-shadow-lg opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-200"
											style={{ filter: "drop-shadow(0 0 10px #000)" }}
										/>
									</div>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />
								</div>
								{/* Description */}
								<div className="text-center text-gray-700 text-base font-medium mt-4 px-2 break-words w-full">
									{video.desc}
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Video Modal */}
				<VideoPlayerModal
					url={modal.url}
					alt={modal.alt}
					open={modal.open}
					onClose={() => setModal({ open: false, url: "", alt: "" })}
				/>
			</div>
		</>
	);
};

export default VideosPage;