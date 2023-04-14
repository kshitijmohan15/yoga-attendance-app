import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { type Dayjs } from "dayjs";
import { Listbox } from "@headlessui/react";
import { DATE_FORMAT_ZOOM } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import Layout from "@/components/Layout";
import { BsTrashFill } from "react-icons/bs";
import { AiTwotonePlusSquare } from "react-icons/ai";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";

function capitalize(string: string) {
	return string?.charAt(0).toUpperCase() + string?.slice(1) ?? "";
}
interface Participant {
	name: string;
	startDate: Date;
	endDate: Date;
}
function UploadCsv() {
	const [file, setFile] = useState();
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [participantsLoaded, setParticipantsLoaded] = useState(false);
	const { mutateAsync: getStudentsInDb, data: studentsInDb } =
		trpc.student.getStudentsAlreadyInDb.useMutation();
	const { mutateAsync: uploadCsv } = trpc.attendance.uploadCsv.useMutation({
		onSuccess: () => {
			toast.success("Attendance uploaded successfully");
			setFile(undefined);
			setParticipants([]);
			setParticipantsLoaded(false);
		},
	});
	const handleFileChange = (event: any) => {
		console.log("file", event.target.files[0]);
		setFile(event.target.files[0]);
	};
	useEffect(() => {
		if (participants.length > 0) {
			getStudentsInDb({
				names: participants.map((item) => item.name),
			});
		}
	}, [participantsLoaded]);
	const handleSubmit = useCallback(() => {
		if (file) {
			const fileUrl = URL.createObjectURL(file);

			fetch(fileUrl)
				.then((res) => res.text())
				.then((text) => {
					// console.log(text);
					const rows = text.split("\n");
					if (rows[0]) {
						const headers = rows[0].split(",");
						const data = rows.slice(1).map((row) => {
							const values = row.split(",");
							const el = headers.reduce(
								(object, header, index) => {
									return {
										...object,
										[header]: values[index],
									};
								},
								{}
							);
							return el;
						});
						setParticipants(
							uniqueParticipants(
								data
									.map((item: any) => {
										return {
											name: capitalize(
												item["Name (Original Name)"]
											),
											joinTime: roundToNearestHalfHour(
												dayjs(
													item["Join Time"],
													DATE_FORMAT_ZOOM
												)
											).format("h:mm A"),
											joinDate: dayjs(
												item["Join Time"],
												DATE_FORMAT_ZOOM
											).format("DD/MM/YYYY"),
											startDate: dayjs(
												item["Join Time"],
												DATE_FORMAT_ZOOM
											).toDate(),
											endDate: dayjs(
												item["Leave Time"],
												DATE_FORMAT_ZOOM
											).toDate(),
											date: dayjs(
												item["Join Time"],
												DATE_FORMAT_ZOOM
											).toDate(),
										};
									})
									.sort((a, b) => {
										return a.name > b.name ? 1 : -1;
									})
									.filter(
										(item) =>
											item.name !== "undefined" &&
											item.name !== "Sweta Mohan" &&
											item.name !== ""
									)
							)
						);
						setParticipantsLoaded(true);
						console.log("HANDLE SUBMIT", data);
					}
				});
		} else {
			console.error("Please select a file");
		}
	}, [file]);
	function roundToNearestHalfHour(date: Dayjs) {
		return date.minute(Math.round(date.minute() / 30) * 30).second(0);
	}
	function generateHourList() {
		const hours = [];

		for (let i = 0; i < 24; i++) {
			const hour = dayjs().hour(i).startOf("hour");
			const hourString = hour.format("h:mm A");
			hours.push(hourString);
		}

		return hours;
	}
	function updateParticipants(name: string, newStartTime: string) {
		setParticipants((participants: any) =>
			participants.map((participant: any) => {
				if (participant.name === name) {
					return { ...participant, joinTime: newStartTime };
				} else {
					return participant;
				}
			})
		);
	}
	useEffect(() => {
		console.log(participants);
	});
	function uniqueParticipants(list: any) {
		const uniqueParticipants = list.filter(
			(currentItem: any, index: number, array: any) => {
				return (
					index ===
					array.findIndex(
						(item: any) =>
							item.name === currentItem.name &&
							item.joinTime === currentItem.joinTime
					)
				);
			}
		);
		return uniqueParticipants;
	}

	return (
		<Layout title="Upload Zoom Attendance">
			<div className="flex flex-col gap-4 text-black">
				<label className="text-xl font-medium">
					Upload a CSV file:
				</label>
				<input type="file" onChange={handleFileChange} />
				{/* {JSON.stringify(participants)} */}
				<div className="flex gap-4">
					<Button
						disabled={typeof file === "undefined"}
						className="w-20"
						onClick={() => handleSubmit()}
					>
						Preview
					</Button>
					<Button
						disabled={!participantsLoaded}
						className="w-20"
						onClick={() => {
							uploadCsv({
								participants: participants.map(
									(participant) => ({
										name: participant.name,
										startDate: participant.startDate,
										endDate: participant.endDate,
									})
								),
							});
						}}
					>
						Upload
					</Button>
				</div>
				{participantsLoaded && (
					<div className="flex gap-3">
						<div className="flex items-center gap-2 bg-green-200 p-1 text-green-700">
							<AiTwotonePlusSquare color="green" />
							<p>Student already in database</p>
						</div>
						<div className="flex items-center gap-2 rounded-md bg-red-200 p-1 text-red-700">
							<AiTwotonePlusSquare color="#E1341E" />
							<p>Student not in database</p>
						</div>
					</div>
				)}
				<table className="w-1/2">
					{participants.map((item: any, index: number) => (
						<tr
							key={index}
							className="flex w-full justify-between gap-10"
						>
							<td
								className={`w-52 ${
									index === 0 ? "rounded-t-md" : ""
								} ${
									index === participants.length - 1 &&
									"rounded-b-md "
								} p-2 font-semibold ${
									studentsInDb &&
									(studentsInDb.students.some(
										(student) => student.name === item.name
									)
										? "bg-green-200 text-green-700"
										: "bg-red-200 text-red-700")
								}`}
							>
								{item.name}
							</td>
							<td>
								<Listbox>
									<Listbox.Button>
										{item.joinTime}
									</Listbox.Button>
									<Listbox.Options className="absolute bg-slate-600">
										{generateHourList().map((hour) => (
											<Listbox.Option
												onClick={() =>
													updateParticipants(
														item.name,
														hour
													)
												}
												key={hour}
												value={hour}
											>
												{hour}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Listbox>
							</td>
							<td>{item.joinDate}</td>
							<td
								onClick={() =>
									setParticipants((past) =>
										past.filter(
											(i, pastIndex) =>
												pastIndex !== index
										)
									)
								}
							>
								<BsTrashFill />
							</td>
						</tr>
					))}
				</table>
			</div>
		</Layout>
	);
}
export default UploadCsv;
