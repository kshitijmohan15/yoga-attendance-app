import React, { FC, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Button } from "../../components/Button";
import DatePicker from "react-datepicker";
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
import { TextField } from "@mui/material";
import { Checkbox } from "../../components/Checkbox";
import { rupee } from "../../lib/constants";

const inter = Inter({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const StudentDetails: FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: student } = trpc.student.getStudent.useQuery({
		id: id as string,
	});

	const {
		mutateAsync: createBatch,
		isLoading: creatingBatch,
		isSuccess: batchCreated,
	} = trpc.batch.createBatch.useMutation({
		onSuccess: (data) => {
			utils.batch.invalidate();
		},
	});

	const { data: batches } = trpc.batch.getBatchesForStudent.useQuery({
		studentId: id as string,
	});
	const utils = trpc.useContext();
	const onSubmit = (data: CreateBatchType) => {
		createBatch({ ...data, studentId: id as string });
	};
	type CreateBatchType = z.infer<typeof batchSchema>;
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		control,
	} = useForm<CreateBatchType>({
		resolver: zodResolver(batchSchema),
	});
	return (
		<Layout title={"Student Name"}>
			<div className="flex flex-col gap-4">
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
				<Dialog>
					<DialogTrigger className="flex w-36 justify-start">
						<div
							className={twMerge(
								"dark:text-bule-800 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:bg-blue-200 dark:hover:bg-blue-300 dark:hover:text-blue-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
								" bg-blue-300 py-2 px-3 font-semibold text-blue-800 hover:bg-blue-400 "
							)}
						>
							New Batch +
						</div>
					</DialogTrigger>
					<DialogContent className="flex items-center justify-center">
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
											Add batch
										</Button>
									</div>
								</form>
								{/* <pre>{JSON.stringify(watch(), null, 2)}</pre>    */}
							</div>
						</DialogHeader>
					</DialogContent>
				</Dialog>
				<div
					className={twMerge(
						"flex h-28 cursor-pointer flex-row items-center ",
						" rounded-md  bg-primary-light px-4 py-6 text-primary-dark transition duration-300 ease-in-out hover:bg-gray-100 dark:bg-primary-dark dark:text-primary-light dark:hover:bg-primary-dark-600"
					)}
				>
					<div className="flex items-baseline gap-2">
						<div className="flex items-center text-3xl text-blue-900 dark:text-blue-200">
							15 Feb
						</div>
						<div className=" flex items-center">to</div>
						<div className="flex items-center text-3xl text-blue-900  dark:text-blue-200">
							20 Mar
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default StudentDetails;
