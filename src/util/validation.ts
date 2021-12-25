// eslint-disable-next-line @typescript-eslint/no-namespace
namespace App {
	export interface Validatable {
		value: string | number;
		required?: boolean;
		minlength?: number;
		maxlength?: number;
		min?: number;
		max?: number;
	}

	export function validate(validatableInput: Validatable) {
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
}
