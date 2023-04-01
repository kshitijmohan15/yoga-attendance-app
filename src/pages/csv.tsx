import { useEffect, useState } from "react";
import csv from "csv-parser";
import dayjs from "dayjs";
import { type Dayjs } from "dayjs";
import { Input, ListInput } from "@/components/Input";
import { Listbox } from "@headlessui/react";
import { DATE_FORMAT_ZOOM } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
function capitalize(string: string) {
	return string?.charAt(0).toUpperCase() + string?.slice(1) ?? "";
}
interface Participant {
	name: string;
	joinTime: string;
	joinDate: string;
	date: Date;
}
function UploadCsv() {
	const [file, setFile] = useState();
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [participantsLoaded, setParticipantsLoaded] = useState(false);
	const { mutateAsync: getStudentsInDb, data: studentsInDb } =
		trpc.student.getStudentsAlreadyInDb.useMutation();
	const { mutateAsync: uploadCsv } = trpc.attendance.uploadCsv.useMutation();
	const handleFileChange = (event: any) => {
		setFile(event.target.files[0]);
	};
	useEffect(() => {
		if (participants.length > 0) {
			getStudentsInDb({
				names: participants.map((item) => item.name),
			});
		}
	}, [participantsLoaded]);
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
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
													"MM/DD/YYYY hh:mm:ss A"
												)
											).format("h:mm A"),
											joinDate: dayjs(
												"03-01-2023  07:01:15",
												DATE_FORMAT_ZOOM
											).format("DD/MM/YYYY"),
											date: dayjs(
												"03-01-2023  07:01:15",
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
						// console.log("DATA", data);
					}
				});
		} else {
			console.error("Please select a file");
		}
	};
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
		<form className="text-white" onSubmit={handleSubmit}>
			<label>
				Upload a CSV file:
				<input type="file" onChange={handleFileChange} />
			</label>
			{/* {JSON.stringify(participants)} */}
			<table className="m-4 w-1/2">
				{participants.map((item: any, index: number) => (
					<tr
						key={index}
						className="flex w-full justify-between gap-10"
					>
						<td
							className={`w-52 ${
								studentsInDb &&
								(studentsInDb.students.some(
									(student) => student.name === item.name
								)
									? "bg-green-500"
									: "bg-red-500")
							}`}
						>
							{item.name}
						</td>
						<td>
							<Listbox>
								<Listbox.Button>{item.joinTime}</Listbox.Button>
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
										(i, pastIndex) => pastIndex !== index
									)
								)
							}
						>
							Delete
						</td>
					</tr>
				))}
			</table>
			<div className="flex flex-col gap-4">
				<button type="submit">Submit</button>
				<button
					onClick={() => uploadCsv({ participants: participants })}
				>
					Upload
				</button>
			</div>
		</form>
	);
}
export default UploadCsv;
