import { ICard, ICardActions } from '../types/index';
import { Component } from './base/Component';

export class Card extends Component<ICard> {
	//Это компонент отображение поэтому при типизации полей мы уже используем непосредственно соответствующий элемент страницы
	//Почему ставим знаки вопроса здесь _category? потому что у нас в макете в зависимости от контекста отображения карточки могут использовать разные данные, например в корзине нет картинки, категории, описания
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _count?: HTMLElement;

	constructor(
		protected blockname: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
	}
}
