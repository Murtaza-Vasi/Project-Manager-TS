/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace App {
	new ProjectInput();
	new ProjectList('active');
	new ProjectList('finished');
}
