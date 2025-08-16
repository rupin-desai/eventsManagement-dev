import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { textVariants } from "../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";



// Dummy video data
const dummyVideos = [
	{
		id: 1,
		vidPath:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		thumbnailPath:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
		desc: "Tree Plantation Drive - Making our environment greener",
	},
	{
		id: 2,
		vidPath:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		thumbnailPath:
			"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
		desc: "Blood Donation Camp - Saving lives together",
	},
	{
		id: 3,
		vidPath:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		thumbnailPath:
			"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
		desc: "Community Clean-Up - Building a better tomorrow",
	},
	{
		id: 4,
		vidPath:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		thumbnailPath:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
		desc: "Education Support Program - Empowering young minds",
	},
	{
		id: 5,
		vidPath:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
		thumbnailPath:
			"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
		desc: "Literacy Program - Reading for everyone",
	},
	{
		id: 6,
		vidPath:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
		thumbnailPath:
			"https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=800&q=80",
		desc: "We Care Month - Spreading joy and kindness",
	},
];

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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate API call with timeout
		const loadVideos = async () => {
			setLoading(true);
			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Use dummy video data
				setVideos(dummyVideos);
			} catch (error) {
				console.error("Error loading videos:", error);
			} finally {
				setLoading(false);
			}
		};

		loadVideos();
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
			<div className="min-h-screen bg-white flex flex-col items-center justify-center py-10">
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

				{/* Loading State */}
				{loading ? (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
						<span className="ml-2 text-gray-600">Loading videos...</span>
					</div>
				) : (
					<>
						{/* Videos Grid */}
						<div className="w-full flex justify-center">
							{videos.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<PlayCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
									<p>No videos available at the moment.</p>
								</div>
							) : (
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
												aria-label={`Play video: ${video.desc}`}
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
													className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
													draggable={false}
													onError={(e) => {
														const target = e.currentTarget as HTMLImageElement;
														if (!target.src.endsWith("smile_logo.png")) {
															target.src = `${BASE_URL}logos/smile_logo.png`;
														}
													}}
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
							)}
						</div>
					</>
				)}

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