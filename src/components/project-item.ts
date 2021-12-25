/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from './base-component.js';
import { Project } from '../models/project.js';
import { AutoBind } from '../decorator/autobind.js';
import { Draggable } from '../models/drag-and-drop.js';
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
	private project: Project;

	get person() {
		return this.project.people > 1 ? 'Persons' : 'Person';
	}

	constructor(hostId: string, project: Project) {
		super('single-project', hostId, false, project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	@AutoBind
	dragStartHandler(event: DragEvent) {
		console.log(this.project.id);
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}

	dragEndHandler(_: DragEvent) {
		console.log('Drag End');
	}

	configure() {
		this.element.addEventListener('dragstart', this.dragStartHandler);
		this.element.addEventListener('dragend', this.dragEndHandler);
	}

	renderContent() {
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent = this.project.people + ' ' + this.person + ' Assigned';
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}
