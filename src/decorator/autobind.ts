// eslint-disable-next-line @typescript-eslint/no-namespace
namespace App {
	// AutoBind decorator
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
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
}
