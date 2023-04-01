import { useState } from "react";
import { Listbox } from "@headlessui/react";
import dayjs from "dayjs";
const people = [
	{ id: 1, name: "Durward Reynolds", unavailable: false },
	{ id: 2, name: "Kenton Towne", unavailable: false },
	{ id: 3, name: "Therese Wunsch", unavailable: false },
	{ id: 4, name: "Benedict Kessler", unavailable: true },
	{ id: 5, name: "Katelyn Rohan", unavailable: false },
];

function MyListbox() {
	const [selectedPerson, setSelectedPerson] = useState(people[0]);
	function generateHourList() {
		const hours = [];

		for (let i = 0; i < 24; i++) {
			const hour = dayjs().hour(i).startOf("hour");
			const hourString = hour.format("h:mm A");
			hours.push(hourString);
		}

		return hours;
	}
	return (
		<div>
			<Listbox value={selectedPerson} onChange={setSelectedPerson}>
				<Listbox.Button className={"font-bold text-white"}>
					{selectedPerson?.name}
				</Listbox.Button>
				<Listbox.Options>
					{people.map((person) => (
						<Listbox.Option
							className={"text-white"}
							key={person.id}
							value={person}
						>
							{person.name}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Listbox>
		</div>
	);
}
export default MyListbox;
