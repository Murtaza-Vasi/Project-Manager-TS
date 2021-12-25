/* eslint-disable @typescript-eslint/no-empty-function */

import { Component } from './base-component.js';
import { Validatable, validate } from '../util/validation.js';
import { AutoBind } from '../decorator/autobind.js';
import { projectState } from '../state/project-state.js';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		super('project-input', 'app', true, 'user-input');

		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

		this.configure();
	}

	renderContent() {}

	configure() {
		this.element.addEventListener('submit', this.submitHandler);
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
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}

	@AutoBind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProjects(title, description, people);
			this.clearInputs();
		}
	}
}
