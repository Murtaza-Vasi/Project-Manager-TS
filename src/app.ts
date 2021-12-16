class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLElement;
	element: HTMLFormElement;

	constructor() {
		this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true) as DocumentFragment;

		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.attach();
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}

const projectInput = new ProjectInput();
