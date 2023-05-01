import {
	MotionValue,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import useMeasure from "react-use-measure";

export default function Dock() {
	let mouseX = useMotionValue(Infinity);

	return (
		<motion.div
			onMouseMove={(e) => mouseX.set(e.pageX)}
			onMouseLeave={() => mouseX.set(Infinity)}
			className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-gray-700 px-4 pb-3"
		>
			{[...Array(8).keys()].map((i) => (
				<AppIcon mouseX={mouseX} key={i} />
			))}
		</motion.div>
	);
}

function AppIcon({ mouseX }: { mouseX: MotionValue }) {
	let [ref, bounds] = useMeasure();

	let distance = useTransform(
		mouseX,
		(val) => val - bounds.left - bounds.width / 2
	);

	let widthSync = useTransform(distance, [-200, 0, 200], [40, 100, 40]);
	let width = useSpring(widthSync, {
		mass: 0.1,
		stiffness: 150,
		damping: 12,
	});

	return (
		<motion.div
			ref={ref}
			style={{ width }}
			className="aspect-square w-10 rounded-full bg-gray-400"
		/>
	);
}
