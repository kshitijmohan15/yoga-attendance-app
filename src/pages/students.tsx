import { Button } from "../components/Button";
import Layout from "../components/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { capitalize } from "lodash";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { AiOutlineCheck } from "react-icons/ai";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/Modal";
import { Input } from "../components/Input";
import { createStudentSchema } from "../schema/studentSchema";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
type CreateStudentType = z.infer<typeof createStudentSchema>;

const CreateStudent = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
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
	const cols: any =
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
			<section className="flex flex-1 flex-col justify-start">
				<div className="flex h-auto w-full justify-start border-b-2 border-primary-light-600 pb-4 dark:border-primary-dark-600">
					<Dialog>
						<DialogTrigger>
							<div
								className={twMerge(
									"dark:text-bule-800 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:bg-blue-200 dark:hover:bg-blue-300 dark:hover:text-blue-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
									" bg-blue-300 py-2 px-3 font-semibold text-blue-800 hover:bg-blue-400 "
								)}
							>
								Add a student
							</div>
						</DialogTrigger>
						<DialogContent className="flex items-center justify-center">
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
				{/* <div className="w-full flex-1">
					<pre>{JSON.stringify(students, null, 2)}</pre>
				</div> */}
				{/* <ul className="mt-4">
					{students
						? students.map((student) => (
								<li
									key={student.id}
									className="relative flex cursor-pointer list-none rounded-md p-3 hover:bg-primary-light-600 dark:hover:bg-primary-dark-600"
								>
									<div className="">{student.name}</div>
								</li>
						  ))
						: ""}
				</ul> */}
				{students && cols && (
					<DataGrid
						className="bg-white text-indigo-600 dark:bg-primary-dark-600 dark:text-primary-light-500"
						sx={{ flex: 1 }}
						rows={students.map((student) => ({
							id: student.id,
							name: student.name,
							email: student.email,
							phone: student.phone,
						}))}
						columns={cols}
					/>
				)}
			</section>
		</Layout>
	);
};

export default CreateStudent;
