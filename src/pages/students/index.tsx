import { Button } from "../../components/Button";
import Layout from "../../components/Layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize, debounce } from "lodash";
import { AiOutlineCheck } from "react-icons/ai";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/Modal";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../../components/Input";
import { createStudentSchema } from "../../schema/studentSchema";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { trpc } from "../../utils/trpc";
import { getSession, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import DeleteModal from "../../components/DeleteStudentModal";
import DataTable from "../../components/DataTable";
import { ListSkeleton } from "../../components/ListSkeleton";
import { useRouter } from "next/router";
import { usePageStore } from "@/store/usePageNo";

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
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<CreateStudentType>({
		resolver: zodResolver(createStudentSchema),
	});

	const utils = trpc.useContext();
	const { data: session } = useSession();
	// const { accessToken } = session;
	const onSubmit: SubmitHandler<CreateStudentType> = (data) => {
		try {
			const newData = {
				...data,
				teacherId: session?.user?.id as string,
			};
			mutateStudent(newData);
		} catch (e) {
			console.log(e);
			throw Error("Error creating student");
		}
	};
	const {
		isLoading: studentInMaking,
		mutate: mutateStudent,
		isSuccess: studentCreated,
	} = trpc.student.createStudent.useMutation({
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			toast.success("Student created successfully");
			utils.student.invalidate();
			reset();
			setModalOpen(false);
		},
	});

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { data, isLoading: studentsAreComing } =
		trpc.student.getStudents.useQuery();
	const students = data?.students;

	const [toBeEdited, setToBeEdited] = useState<string>("");
	const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
	const { mutateAsync: updateStudent } = trpc.student.editStudent.useMutation(
		{
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: (data) => {
				utils.student.invalidate();
				setUpdateModalOpen(false);
				toast.success("Student updated successfully");
			},
		}
	);
	const [toBeDeleted, setToBeDeleted] = useState<string>("");
	const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
	const { mutateAsync: deleteStudent } =
		trpc.student.deleteStudent.useMutation({
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: (data) => {
				utils.student.invalidate();
				setDeleteModalOpen(false);
				toast.success("Student deleted successfully");
			},
		});

	const [searchTerm, setSearchTerm] = useState<string>("");

	const handleSearch = (e: any) => {
		setSearchTerm(e.target.value);
	};
	const router = useRouter();
	const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);
	const pageNo = usePageStore((state) => state.pageNo);
	return (
		<Layout title="Create Student">
			<section className="flex flex-col justify-start">
				<div className="flex h-auto w-full items-center justify-between border-b-2 border-primary-light-600 pb-4 dark:border-primary-dark-600">
					<div className="flex gap-2">
						<div
							className={twMerge(
								"dark:text-bule-800 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:bg-blue-200 dark:hover:bg-blue-300 dark:hover:text-blue-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
								" cursor-pointer bg-blue-300 py-2 px-3 font-semibold text-blue-800 hover:bg-blue-400"
							)}
							onClick={() => {
								reset({});
								setModalOpen(true);
							}}
						>
							Add a student
						</div>
						{/* <div
							className={twMerge(
								"dark:text-bule-800 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:bg-blue-200 dark:hover:bg-blue-300 dark:hover:text-blue-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
								" cursor-pointer bg-blue-300 py-2 px-3 font-semibold text-blue-800 hover:bg-blue-400"
							)}
							onClick={() => {
								router.push("/csv");
							}}
						>
							Upload new attendance
						</div> */}
					</div>
					<Input
						onChange={(e) => debouncedHandleSearch(e)}
						placeholder="Search"
						className="w-[6rem] rounded-md border-[3px] border-blue-200 md:w-40 lg:w-60"
					/>
				</div>

				<div className="flex justify-center">
					<div className="flex w-full flex-col">
						<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
								<div className=" overflow-auto">
									{students ? (
										<DataTable
											reset={reset}
											setToBeEdited={setToBeEdited}
											setToBeDeleted={setToBeDeleted}
											setUpdateModalOpen={
												setUpdateModalOpen
											}
											setDeleteModalOpen={
												setDeleteModalOpen
											}
											data={students?.filter((i) =>
												i.name
													.toLowerCase()
													.includes(
														searchTerm.toLowerCase()
													)
											)}
										/>
									) : null}
									{studentsAreComing && <ListSkeleton />}
								</div>
							</div>
						</div>
					</div>
				</div>
				<Dialog open={updateModalOpen}>
					<DialogContent setOpen={setUpdateModalOpen}>
						<DialogHeader>
							<DialogTitle>Edit your batches!</DialogTitle>
						</DialogHeader>
						<div className="flex flex-1">
							<form
								className=" flex-col gap-4 "
								onSubmit={handleSubmit((data) => {
									updateStudent({ ...data, id: toBeEdited });
								})}
							>
								<div className="grid grid-cols-2 gap-4">
									<label className="block ">
										<span className="text-md font-medium text-gray-500 dark:text-gray-200">
											Name {watch().name}
										</span>
										<Input
											defaultValue={watch().name}
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
											type={"number"}
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
								<div className="mt-4 block">
									<Button
										className=" bg-green-300 py-2 px-3 font-semibold text-green-800 hover:bg-green-400"
										type="submit"
									>
										Update Batch
									</Button>
								</div>
							</form>
						</div>
					</DialogContent>
				</Dialog>
				<Dialog open={modalOpen}>
					{/* <DialogTrigger onClick={() => reset({})}></DialogTrigger> */}
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
												type={"number"}
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
				<DeleteModal
					onAccept={() => {
						deleteStudent({ id: toBeDeleted });
					}}
					open={deleteModalOpen}
					setOpen={setDeleteModalOpen}
				/>
			</section>
		</Layout>
	);
};

export default CreateStudent;
