import { ICardActions, IDeliveryForm, IEvents } from '../types';
import { ensureElement } from '../utils/utils';
import { Form } from './common/Form';

export class deliveryForm extends Form<IDeliveryForm> {
	protected _onlinePaymend: HTMLButtonElement;
	protected _cashPaymend: HTMLButtonElement;
	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions: ICardActions
	) {
		super(container, events);
		this._onlinePaymend = ensureElement<HTMLButtonElement>(
			`button[name=card]`,
			this.container
		);
		this._cashPaymend = ensureElement<HTMLButtonElement>(
			`button[name=cash]`,
			this.container
		);
		if (actions.onClick) {
			this._onlinePaymend.addEventListener('click', actions.onClick);
			this._cashPaymend.addEventListener('click', actions.onClick);
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	tooglePaymendButtons(changeButton: HTMLButtonElement): void {
		this._onlinePaymend.classList.remove('button_alt-active');
		this._cashPaymend.classList.remove('button_alt-active');
		changeButton.classList.add('button_alt-active');
	}

	clearPaymentSelection() {
		this._onlinePaymend.classList.remove('button_alt-active');
		this._cashPaymend.classList.remove('button_alt-active');
	}
}
