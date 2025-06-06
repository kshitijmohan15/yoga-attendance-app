import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Lottie from "react-lottie";
import animationData from "../lotties/calendar.json";
import { BsArrowRight } from "react-icons/bs";
import { Button } from "@/components/Button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import AvatarHovered from "@/components/AvatarHovered";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/Dropdown";
import { motion } from "framer-motion";
import { NextSeo } from "next-seo";

const Home: NextPage = () => {
	const { data: session } = useSession();
	return (
		<>
			{/* <Head>
				<title>Upastithi</title>
				<meta
					name="description"
					content="Manage your attendance with ease."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head> */}
			<NextSeo
				title="Upastithi - Digital Attendance Management for Online Educators and Teachers"
				description="Streamline your attendance management workflow with Upastithi. Easily upload Zoom attendance, and we will take care of the rest. Seamlessly monitor students batches and their payment status with our intuitive dashboard. Simplify attendance tracking and enhance productivity with our powerful attendance management system."
				openGraph={{
					url: "https://upastithi.com/",
					title: "Upastithi - Attendance Management for Online Educators",
					description:
						"Manage your attendance with ease. Upload Zoom reports and we will take care of the rest. More integrations coming soon.",
					type: "website",
				}}
			/>
			<nav className="sticky left-0 top-0 z-10 flex w-full items-center justify-between px-6 py-4 backdrop-blur-md">
				{/* <ThemeToggle /> */}

				<ul className="text-primary-dark-500 dark:text-primary-light-500 flex items-center justify-center gap-4">
					<Button
						size={"sm"}
						className=" flex items-center justify-center gap-2 font-semibold"
						onClick={() =>
							session
								? signOut()
								: signIn("google", { callbackUrl: "/students" })
						}
					>
						{!session ? (
							<>
								<FaGoogle />
								<div>SIGN IN</div>
							</>
						) : (
							<div>SIGN OUT</div>
						)}
					</Button>
					{session?.user?.image && (
						<DropdownMenu>
							<DropdownMenuTrigger>
								<AvatarHovered
									user={session.user}
									imgURL={session.user.image}
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-gray-100">
								<DropdownMenuLabel>
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link href={"/students"}>Student</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</ul>
			</nav>
			<main className="bg-primary-light-500 flex min-h-full w-full">
				<section className="flex h-screen items-start px-4 lg:items-center lg:px-10">
					<div className="flex flex-col justify-between lg:flex-row">
						<div className="mt-24 flex w-full flex-col gap-2 lg:w-3/4">
							<h1 className="text-left text-3xl font-semibold text-gray-700 lg:text-5xl">
								Welcome to Upastithi.
							</h1>
							<p className="text-left text-lg font-normal text-gray-500 lg:text-xl">
								The perfect tool to easily manage attendance and
								streamline their workflow. With our app, you can
								say goodbye to time-consuming manual attendance
								registration and hello to a hassle-free,
								automated system that integrates seamlessly with
								Zoom.
							</p>
							{session && (
								<div className="mt-4">
									<Link
										href="/students"
										className="group relative flex w-fit"
									>
										<motion.div className="absolute inset-0 z-10 m-0 rounded-lg bg-gray-300 transition-all duration-100 ease-in group-hover:-m-[3px]"></motion.div>
										<Button className="z-20">
											<div className="flex items-center gap-2">
												<p>Go To Students</p>
												<BsArrowRight />
											</div>
										</Button>
									</Link>
								</div>
							)}
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
								height={500}
								width={500}
							/>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// const session = await getSession(context);
	// if (session) {
	// 	return {
	// 		redirect: {
	// 			destination: "/students",
	// 		},
	// 	};
	// }
	return {
		props: {},
	};
}
