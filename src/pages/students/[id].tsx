import React, { FC, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Button } from "../../components/Button";
import DatePicker from "react-datepicker";
import { AiOutlineCheck } from "react-icons/ai";

import { RxTrash, RxPencil1 } from "react-icons/rx";
import "react-datepicker/dist/react-datepicker.css";
import { Inter } from "@next/font/google";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/Modal";
import { twMerge } from "tailwind-merge";
import { useForm, Controller } from "react-hook-form";
import { batchSchema } from "../../schema/batchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/Input";
import dayjs from "dayjs";
import { rupee } from "../../lib/constants";
import ListItem from "../../components/ListItem";
import { getSession } from "next-auth/react";

const inter = Inter({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
function formatAsDate(date: Date) {
	return dayjs(date).format("DD MMM YYYY");
}

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

const StudentDetails: FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: student, isLoading: studentIsLoading } =
		trpc.student.getStudent.useQuery(
			{
				id: id as string,
			},
			{ refetchOnWindowFocus: false }
		);

	const {
		mutateAsync: createBatch,
		isLoading: creatingBatch,
		isSuccess: createdBatch,
	} = trpc.batch.createBatch.useMutation({
		onSuccess: () => {
			utils.batch.invalidate();
			setCreateModalOpen(false);
			reset();
		},
	});
	const {
		mutateAsync: editBatch,
		isLoading: batchPatching,
		isSuccess: batchPatched,
	} = trpc.batch.editBatch.useMutation({
		onSuccess: () => {
			utils.batch.invalidate();
			console.log("UPDATED!");
			setUpdateModalOpen(false);
			reset();
		},
	});
	const { data: batches } = trpc.batch.getBatchesForStudent.useQuery({
		studentId: id as string,
	});
	const utils = trpc.useContext();
	const onSubmit = (data: CreateBatchType) => {
		createBatch({ ...data, studentId: id as string });
	};
	const [toBeEdited, setToBeEdited] = useState<string>("");
	const onPatchBatch = (data: CreateBatchType) => {
		editBatch({
			amount: data.amount,
			endDate: data.endDate,
			paid: data.paid,
			startDate: data.startDate,
			id: toBeEdited,
		});
	};
	type CreateBatchType = z.infer<typeof batchSchema>;
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
		control,
	} = useForm<CreateBatchType>({
		resolver: zodResolver(batchSchema),
	});

	const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
	const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
	return (
		<Layout title={"Student Name"}>
			<div className="flex flex-col gap-4">
				{!studentIsLoading && student ? (
					<div>
						<h1 className="text-4xl">{student?.name}</h1>
						<div className="flex gap-2">
							<p className="font-semibold text-gray-600">
								{student?.email}
							</p>
							<span>•</span>
							<p className="font-semibold text-gray-600">
								{student?.phone}
							</p>
						</div>
					</div>
				) : (
					""
				)}
				<Dialog open={createModalOpen}>
					<DialogTrigger
						onClick={() => {
							reset({ startDate: undefined, endDate: undefined });
							setCreateModalOpen(true);
						}}
						className="flex w-36 justify-start"
					>
						<div
							className={twMerge(
								"dark:text-bule-800 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:bg-blue-200 dark:hover:bg-blue-300 dark:hover:text-blue-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
								" bg-blue-300 py-2 px-3 font-semibold text-blue-800 hover:bg-blue-400 "
							)}
						>
							New Batch +
						</div>
					</DialogTrigger>
					<DialogContent
						setOpen={setCreateModalOpen}
						className="flex items-center justify-center"
					>
						<DialogHeader>
							<DialogTitle>
								Create a new batch for {student?.name}
							</DialogTitle>
							{/* <DialogDescription>
									Use the form below to add a new student to
									your class.
								</DialogDescription> */}
							<div className="flex flex-1">
								<form
									className=" flex-col gap-4 "
									onSubmit={handleSubmit(onSubmit)}
								>
									<div className="grid grid-cols-2 gap-4">
										<label className="block space-y-1">
											<span className="text-md   text-gray-500 dark:text-gray-400">
												Start Date
											</span>
											<Controller
												name={"startDate"}
												control={control}
												render={({
													field: { onChange, value },
												}) => (
													<DatePicker
														preventOpenOnFocus={
															true
														}
														startOpen={false}
														autoFocus={false}
														dateFormat={
															"dd/MM/yyyy"
														}
														selected={value}
														onChange={onChange}
														customInput={
															<Input className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm" />
														}
													/>
												)}
											/>

											{errors.startDate && (
												<p className="mt-1 text-sm text-red-700">
													{errors.startDate.message}
												</p>
											)}
										</label>
										<label className="block space-y-1">
											<span className="text-md  text-gray-500 dark:text-gray-400">
												End Date
											</span>
											<Controller
												name={"endDate"}
												control={control}
												render={({
													field: { onChange, value },
												}) => (
													<DatePicker
														preventOpenOnFocus={
															true
														}
														startOpen={false}
														autoFocus={false}
														dateFormat={
															"dd/MM/yyyy"
														}
														selected={value}
														onChange={onChange}
														customInput={
															<Input className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm" />
														}
													/>
												)}
											/>
											{errors.endDate && (
												<p className="mt-1 text-sm text-red-700">
													{errors.endDate.message}
												</p>
											)}
										</label>
										<label className="block space-y-1">
											<span className="text-md text-gray-500 dark:text-gray-400">
												Amount
											</span>
											<Input
												placeholder={rupee + " 1000"}
												type={"number"}
												{...register("amount", {
													valueAsNumber: true,
												})}
												className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
											/>
											{errors.amount && (
												<p className="mt-1 text-sm text-red-700">
													{errors.amount.message}
												</p>
											)}
										</label>
									</div>
									<label className="flex items-center justify-center gap-2 pt-6">
										<span className="text-md text-gray-500 dark:text-gray-400">
											Paid
										</span>
										<Input
											{...register("paid")}
											type={"checkbox"}
											className="h-4 w-4 rounded border-gray-300 text-green-600"
										/>
										{errors.paid && (
											<p className="mt-1 text-sm text-red-700">
												{errors.paid.message}
											</p>
										)}
									</label>
									<div className="mt-4 block">
										<Button
											className=" bg-green-300 py-2 px-3 font-semibold text-green-800 hover:bg-green-400"
											type="submit"
										>
											{creatingBatch ? (
												"Creating..."
											) : createdBatch ? (
												<AiOutlineCheck color="green" />
											) : (
												"Create"
											)}
										</Button>
									</div>
								</form>
							</div>
						</DialogHeader>
					</DialogContent>
				</Dialog>
				{batches?.map((batch) => {
					return (
						<ListItem
							key={batch.id}
							intent={batch.paid ? "paid" : "unpaid"}
							classNames="items-center"
						>
							<div className="flex flex-col items-baseline gap-2 sm:flex-row ">
								<div className="text-sm font-semibold md:text-lg lg:text-xl">
									{formatAsDate(batch.startDate)}
								</div>
								<div className="">to</div>
								<div className="text-sm font-semibold md:text-lg lg:text-xl">
									{formatAsDate(batch.endDate)}
								</div>
							</div>
							<div className="flex h-full flex-1 items-center justify-end">
								<p className="text-md font-bold md:text-lg lg:text-2xl">
									{rupee} {batch.amount}
								</p>
								<div
									onClick={() => {
										setToBeEdited(batch.id);
										reset({
											startDate: batch.startDate,
											endDate: batch.endDate,
											amount: batch.amount,
											paid: batch.paid,
										});
										setUpdateModalOpen(true);
									}}
									className="flex items-center gap-2 px-4"
								>
									<RxPencil1
										size={30}
										className="rounded-md p-1 shadow-md"
									/>
								</div>
							</div>
						</ListItem>
					);
				})}
				<Dialog open={updateModalOpen}>
					<DialogContent setOpen={setUpdateModalOpen}>
						<DialogHeader>
							<DialogTitle>Edit your batches!</DialogTitle>
						</DialogHeader>
						<div className="flex flex-1">
							<form
								className=" flex-col gap-4 "
								onSubmit={handleSubmit(onPatchBatch)}
							>
								<div className="grid grid-cols-2 gap-4">
									<label className="block space-y-1">
										<span className="text-md   text-gray-500 dark:text-gray-400">
											Start Date
										</span>
										<Controller
											name={"startDate"}
											control={control}
											render={({
												field: { onChange, value },
											}) => (
												<DatePicker
													preventOpenOnFocus={true}
													startOpen={false}
													selected={
														watch().startDate &&
														!value
															? watch().startDate
															: value
													}
													onChange={onChange}
													customInput={
														<Input className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm" />
													}
												/>
											)}
										/>

										{errors.startDate && (
											<p className="mt-1 text-sm text-red-700">
												{errors.startDate.message}
											</p>
										)}
									</label>
									<label className="block space-y-1">
										<span className="text-md  text-gray-500 dark:text-gray-400">
											End Date
										</span>
										<Controller
											name={"endDate"}
											control={control}
											render={({
												field: { onChange, value },
											}) => (
												<DatePicker
													preventOpenOnFocus={true}
													startOpen={false}
													selected={
														watch().endDate &&
														!value
															? watch().endDate
															: value
													}
													onChange={onChange}
													customInput={
														<Input className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm" />
													}
												/>
											)}
										/>
										{errors.endDate && (
											<p className="mt-1 text-sm text-red-700">
												{errors.endDate.message}
											</p>
										)}
									</label>
									<label className="block space-y-1">
										<span className="text-md text-gray-500 dark:text-gray-400">
											Amount
										</span>
										<Input
											placeholder={rupee + " 1000"}
											type={"number"}
											{...register("amount", {
												valueAsNumber: true,
											})}
											defaultValue={watch().amount}
											className="text-md w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
										/>
										{errors.amount && (
											<p className="mt-1 text-sm text-red-700">
												{errors.amount.message}
											</p>
										)}
									</label>
								</div>
								<label className="flex items-center justify-center gap-2 pt-6">
									<span className="text-md text-gray-500 dark:text-gray-400">
										Paid
									</span>

									<Controller
										name={"paid"}
										control={control}
										render={({
											field: { onChange, value },
										}) => (
											<Input
												onChange={onChange}
												type={"checkbox"}
												defaultChecked={
													value ?? watch().paid
												}
												className="h-4 w-4 rounded border-gray-300 text-green-600"
											/>
										)}
									/>

									{errors.paid && (
										<p className="mt-1 text-sm text-red-700">
											{errors.paid.message}
										</p>
									)}
								</label>

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
			</div>
		</Layout>
	);
};

export default StudentDetails;
