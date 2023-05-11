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


const Home: NextPage = () => {
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
				{/* <ThemeToggle /> */}

				<ul className="flex items-center justify-center gap-4 text-primary-dark-500 dark:text-primary-light-500">
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
			<main className="flex min-h-full w-full bg-primary-light-500">
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
									<Link href="/students" className="flex">
										<Button className="flex items-center gap-2">
											<p>Go To Students</p>
											<BsArrowRight />
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
