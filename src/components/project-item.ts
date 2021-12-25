/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="base-component.ts" />
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace App {
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
}
