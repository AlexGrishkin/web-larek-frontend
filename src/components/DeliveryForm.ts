import { ICardActions, IDeliveryForm, IEvents } from '../types';
import { ensureElement } from '../utils/utils';
import { Form } from './common/Form';

export class deliveryForm extends Form<IDeliveryForm> {
	protected _onlinePaymend: HTMLButtonElement;
	protected _cashPaymend: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._onlinePaymend = ensureElement<HTMLButtonElement>(
			`button[name=card]`,
			this.container
		);
		this._cashPaymend = ensureElement<HTMLButtonElement>(
			`button[name=cash]`,
			this.container
		);
		this._onlinePaymend.addEventListener('click', () =>
			this.tooglePaymendButtons(this._onlinePaymend)
		);
		this._cashPaymend.addEventListener('click', () =>
			this.tooglePaymendButtons(this._cashPaymend)
		);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	// Когда метод класса объявлен как private, он автоматически привязывается к экземпляру класса, поэтому вызовы этого метода из обработчиков событий будут работать корректно без явного использования bind
	private tooglePaymendButtons(changeButton: HTMLButtonElement): void {
		this._onlinePaymend.classList.remove('button_alt-active');
		this._cashPaymend.classList.remove('button_alt-active');
		changeButton.classList.add('button_alt-active');
	}
}
