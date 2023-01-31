import { Button } from "../../components/Button";
import Layout from "../../components/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { AiOutlineCheck } from "react-icons/ai";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/Modal";
import { useState } from "react";
import { Input } from "../../components/Input";
import { createStudentSchema } from "../../schema/studentSchema";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { trpc } from "../../utils/trpc";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
type CreateStudentType = z.infer<typeof createStudentSchema>;
export async function getServerSideProps(context: any) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}

const CreateStudent = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateStudentType>({
		resolver: zodResolver(createStudentSchema),
	});
	const { data: session } = useSession();
	const onSubmit: SubmitHandler<CreateStudentType> = (data) => {
		const { email, name, phone } = data;
		try {
			mutateStudent({
				email,
				name,
				phone,
				teacherId: session?.user?.id as string,
			});
		} catch {
			throw Error("Error creating student");
		}
	};
	const utils = trpc.useContext();
	const {
		data: createdStudent,
		isLoading: studentInMaking,
		mutate: mutateStudent,
		isSuccess: studentCreated,
	} = trpc.student.createStudent.useMutation({
		onError: (error) => {
			console.log("onError", error);
		},
		onSuccess: (data) => {
			utils.student.invalidate();
		},
	});
	const { data } = trpc.student.getStudents.useQuery();
	const students = data?.students;
	const cols =
		students &&
		students[0] &&
		Object.keys(students[0])
			.filter(
				(item) =>
					item === "name" || item === "email" || item === "phone"
			)
			.map((key) => {
				return {
					field: key,
					headerName: capitalize(key),
					width: 200,
				};
			});
	return (
		<Layout title="Create Student">
			<section className="flex flex-col justify-start">
				<div className="flex h-auto w-full justify-start border-b-2 border-primary-light-600 pb-4 dark:border-primary-dark-600">
					<Dialog>
						<DialogTrigger onClick={() => reset()}>
							<div
								className={twMerge(
									"dark:text-bule-800 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:bg-blue-200 dark:hover:bg-blue-300 dark:hover:text-blue-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
									" bg-blue-300 py-2 px-3 font-semibold text-blue-800 hover:bg-blue-400 "
								)}
							>
								Add a student
							</div>
						</DialogTrigger>
						<DialogContent
							setOpen={setModalOpen}
							className="flex items-center justify-center"
						>
							<DialogHeader>
								<DialogTitle>Add a new student!</DialogTitle>
								{/* <DialogDescription>
									Use the form below to add a new student to
									your class.
								</DialogDescription> */}
								<div className="flex flex-1">
									<form
										className=" flex-col gap-4 "
										onSubmit={handleSubmit(onSubmit)}
									>
										<div className="grid grid-cols-2 gap-2">
											<label className="block ">
												<span className="text-md font-medium text-gray-500 dark:text-gray-200">
													Name
												</span>
												<Input
													{...register("name")}
													className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
												/>
												{errors.name && (
													<p className="mt-1 text-sm text-red-700">
														{errors.name.message}
													</p>
												)}
											</label>
											<label className="block ">
												<span className="text-md font-medium text-gray-500 dark:text-gray-200">
													Email
												</span>
												<Input
													{...register("email")}
													className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
												/>
												{errors.email && (
													<p className="mt-1 text-sm text-red-700">
														{errors.email.message}
													</p>
												)}
											</label>
											<label className="block ">
												<span className="text-md font-medium text-gray-500 dark:text-gray-200">
													Phone
												</span>
												<Input
													{...register("phone")}
													className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
												/>
												{errors.phone && (
													<p className="mt-1 text-sm text-red-700">
														{errors.phone.message}
													</p>
												)}
											</label>
										</div>
										<div className="mt-6 block">
											<Button
												className=" bg-green-300 py-2 px-3 font-semibold text-green-800 hover:bg-green-400"
												type="submit"
											>
												{studentInMaking ? (
													"Updating..."
												) : studentCreated ? (
													<AiOutlineCheck
														color="green"
														fontSize={25}
													/>
												) : (
													"Add Student"
												)}
											</Button>
										</div>
									</form>
								</div>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>

				<div className="flex justify-center">
					<div className="flex w-full flex-col">
						<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
								<div className="overflow-hidden">
									<table className="min-w-full ">
										<thead className=" border-b bg-primary-light dark:bg-primary-dark">
											<tr className=" text-gray-500 dark:text-primary-light-600">
												<th
													scope="col"
													className="text-md px-6 py-4 text-left font-semibold"
												>
													Name
												</th>
												<th
													scope="col"
													className="text-md px-6 py-4 text-left font-semibold"
												>
													Email
												</th>
												<th
													scope="col"
													className="text-md px-6 py-4 text-left font-semibold"
												>
													Number
												</th>
											</tr>
										</thead>
										<tbody>
											{students?.map((student) => (
												<tr
													key={student.id}
													className=" rounded-md border-[1px] border-b border-gray-400 bg-primary-light text-primary-dark transition duration-300 ease-in-out hover:bg-gray-100 dark:bg-primary-dark dark:text-primary-light"
												>
													<td className="cursor-pointer whitespace-nowrap px-6 py-4 text-sm font-medium ">
														<Link
															href={
																"/students/" +
																student.id
															}
														>
															{student.name}
														</Link>
													</td>
													<td className="whitespace-nowrap px-6 py-4 text-sm font-light ">
														{student.email}
													</td>
													<td className="whitespace-nowrap px-6 py-4 text-sm font-light ">
														{student.phone}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default CreateStudent;
