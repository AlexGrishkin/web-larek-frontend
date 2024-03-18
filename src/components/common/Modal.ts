import { IEvents, IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		//Метод bind() используется для создания новой функции, которая, при вызове, имеет указанный контекст (this), установленный в предоставленное значение. Он позволяет явно привязать контекст выполнения функции, что бы при вызове close вне экземпляра класса, он точно брал исходные данные из этого экземпляра
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		//клик на содержимом модального окна не будет приводить к закрытию модального окна или вызову других обработчиков клика, которые могли бы быть назначены на родительские элементы.
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
