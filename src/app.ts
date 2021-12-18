// class Project
enum ProjectStatus {
	Active,
	Finished,
}

class Project {
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

type Listener = (items: Project[]) => void;

// Project State Management

class ProjectState {
	private listeners: Listener[] = [];
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new ProjectState();
		return this.instance;
	}

	addProjects(title: string, description: string, numOfPeople: number) {
		const newProject = new Project(title, description, numOfPeople, ProjectStatus.Active);

		this.projects.push(newProject);

		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
	}
}

const projectState = ProjectState.getInstance();

interface Validatable {
	value: string | number;
	required?: boolean;
	minlength?: number;
	maxlength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length !== 0;
	}

	if (validatableInput.minlength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.length >= validatableInput.minlength;
	}

	if (validatableInput.maxlength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.length <= validatableInput.maxlength;
	}

	if (validatableInput.min != null && typeof validatableInput.value === 'number') {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}

	if (validatableInput.max != null && typeof validatableInput.value === 'number') {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}

	return isValid;
}

// AutoBind decorator
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const newDescriptor: PropertyDescriptor = {
		enumerable: false,
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};
	return newDescriptor;
}

// ProjectList class
class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;
	assignedProjects: Project[];

	constructor(private type: 'active' | 'finished') {
		this.templateElement = document.getElementById('project-list') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;
		this.assignedProjects = [];
		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as HTMLElement;

		this.element.id = `${this.type}-project`;
		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects;
			this.renderProjects();
		});

		this.attach();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = document.getElementById(`${this.type}-projects-list`);
		for (const projectItem of this.assignedProjects) {
			const listItem = document.createElement('li');
			listItem.textContent = projectItem.title;
			listEl?.appendChild(listItem);
		}
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.element.querySelector('ul')!.id = listId;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.element);
	}
}

class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true) as DocumentFragment;

		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = 'user-input';

		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const description = this.descriptionInputElement.value;
		const people = this.peopleInputElement.value;

		const titleValidatable: Validatable = {
			value: title,
			required: true,
		};

		const descriptionValidatable: Validatable = {
			value: description,
			required: true,
			minlength: 5,
		};

		const peopleValidatable: Validatable = {
			value: +people,
			required: true,
			min: 1,
			max: 5,
		};

		if (validate(titleValidatable) && validate(descriptionValidatable) && validate(peopleValidatable)) {
			return [title, description, +people];
		} else {
			alert('Invalid input! Please try again!');
			return;
		}
	}

	private clearInputs() {
		this.titleInputElement.value = '';
		this.peopleInputElement.value = '';
		this.descriptionInputElement.value = '';
	}

	@AutoBind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProjects(title, description, people);
		}

		this.clearInputs();
	}

	private configure() {
		this.element.addEventListener('submit', this.submitHandler.bind(this));
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
