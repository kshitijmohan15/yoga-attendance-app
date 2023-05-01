import { type NextPage } from "next";
import Head from "next/head";
import Lottie from "react-lottie";
import animationData from "../lotties/hero-lady.json";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { toast } from "react-toastify";
import ThemeToggle from "@/components/ThemeToggleButton";
import Link from "next/link";
import { FaGoogle, FaUsers } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import AvatarHovered from "@/components/AvatarHovered";

const emailValidation = z.string().email();

const Home: NextPage = () => {
	const [isJoined, setIsJoined] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const { data: session } = useSession();
	return (
		<>
			<Head>
				<title>Upastithi</title>
				<meta
					name="description"
					content="Manage your attendance with ease."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<nav className="sticky left-0 top-0 z-10 flex w-full items-center justify-between px-6 py-4 backdrop-blur-md">
				<ThemeToggle />

				<ul className="flex items-center justify-center gap-4 text-primary-dark-500 dark:text-primary-light-500">
					<Button
						size={"sm"}
						className=" flex items-center justify-center gap-2 font-semibold"
						onClick={() => (session ? signOut() : signIn("google",{callbackUrl: "/students"}))}
					>
						{!session ? (
							<>
								<FaGoogle />
								<div>SIGN IN WITH GOOGLE</div>
							</>
						) : (
							<div>SIGN OUT</div>
						)}
					</Button>
					{session?.user?.image && (
						<AvatarHovered
							user={session.user}
							imgURL={session.user.image}
						/>
					)}
				</ul>
			</nav>
			<main className="flex min-h-full w-full">
				<section className="h-scrFeen flex items-start px-4 lg:items-center lg:px-10">
					<div className="flex flex-col lg:flex-row">
						<div className="mt-24 flex w-full flex-col gap-2">
							<h1 className="text-left text-3xl font-semibold text-white lg:text-5xl">
								Welcome to Upastithi.
							</h1>
							<p className="text-left text-lg font-normal text-gray-300 lg:text-xl">
								The perfect tool to easily manage attendance and
								streamline their workflow. With our app, you can
								say goodbye to time-consuming manual attendance
								registration and hello to a hassle-free,
								automated system that integrates seamlessly with
								Zoom.
							</p>
							<div className="mt-4 flex flex-col gap-4 md:flex-row">
								<Input
									onChange={(event) =>
										setEmail(event.target.value)
									}
									placeholder="Email"
									className="w-60 lg:w-96"
								/>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 1 }}
								>
									<Button
										className={
											isJoined
												? "cursor-default bg-green-600 hover:bg-green-500"
												: ""
										}
										onClick={() => {
											if (
												!emailValidation.safeParse(
													email
												).success
											) {
												toast.error("Invalid email!");
												return;
											}
											if (isJoined) return;
											setIsJoined(true);
											toast.success(
												"Your email has been added to our list!"
											);
										}}
									>
										{isJoined
											? "Joined"
											: "Join the waitlist"}
									</Button>
								</motion.div>
							</div>
						</div>
						<div className="hidden lg:block">
							<Lottie
								options={{
									animationData: animationData,
									loop: true,
									autoplay: true,
									rendererSettings: {
										preserveAspectRatio: "xMidYMid slice",
									},
								}}
								height={400}
								width={350}
							/>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default Home;

// export function getServerSideProps() {
// 	return {
// 		// const session = await getSession({ req });
// 		redirect: {
// 			destination: "/students",
// 		},
// 	};
// }
