import { IDeliveryForm, IEvents } from '../types';
import { Form } from './common/Form';

export class deliveryForm extends Form<IDeliveryForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
