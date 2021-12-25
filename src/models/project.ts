// class Project
export enum ProjectStatus {
	Active,
	Finished,
}

export class Project {
	id: string;
	title: string;
	description: string;
	people: number;
	status: ProjectStatus;

	constructor(title: string, description: string, people: number, status: ProjectStatus) {
		this.id = Math.random().toString();
		this.title = title;
		this.description = description;
		this.people = people;
		this.status = status;
	}
}
