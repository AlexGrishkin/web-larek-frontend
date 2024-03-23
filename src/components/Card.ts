import { ICard, ICardActions } from '../types/index';
import { Component } from './base/Component';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { categories } from '../utils/constants';

export class Card extends Component<ICard> {
	//Это компонент отображение поэтому при типизации полей мы уже используем непосредственно соответствующий элемент страницы
	//Почему ставим знаки вопроса здесь _category? потому что у нас в макете в зависимости от контекста отображения карточки могут использовать разные данные, например в корзине нет картинки, категории, описания
	//Но в случае если мы применим к protected _description?: HTMLElement; метод ensureElement для инициализации, то мы столкнемся с критической ошибкой, поскольку это предусмотрено методом, даже с учетом что вернет undefined. Обычный querySelector позволит избежать этого и просто вернет undefined
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _count?: HTMLElement;

	//В конструктор мы передаем динамическое имя блока в данном случае card, непосредственный контейнер в котором находится карточка в зависимости от контекста и событие которое либо обрабатывает клик по кнопке либо клик по самой карточке
	constructor(
		protected blockname: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		//Конструктор родительского класса Component принимает контейнер элемента с которым работаем
		super(container);
		//
		this._category = container.querySelector(`.${blockname}__category`);
		this._title = ensureElement<HTMLElement>(`.${blockname}__title`, container);
		this._image = container.querySelector(`.${blockname}__image`);
		this._price = ensureElement<HTMLElement>(`.${blockname}__price`, container);
		this._description = container.querySelector(`.${blockname}__text`);
		this._button = container.querySelector(`.${blockname}__button`);
		this._count = container.querySelector(`.${blockname}__item-index`);
		//если кнопка найдена, присваиваем ей обработчик, если нет присваиваем обработчик карточке
		//такой код позволяет нам гибко устанавливать обработчики событий в зависимости от нужного контекста
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	//Присваиваем контейнеру атрибуты данных data-* (в данном случае data-id).
	//Сам объект dataset является свойством элемента DOM в JavaScript, которое предоставляет доступ к пользовательским атрибутам данных (data-*) элемента.
	//Если мы например к контейнеру применим просто dataset, то мы получим объект содержащий пары ключ значение, где ключ это имя data-* атрибута, а значение это то что непостредственно указано в атрибуте. Причем типизация значений будет сохраняться
	//Присваиваем id атрибут контейнеру
	set id(value: string) {
		this.container.dataset.id = value;
	}
	//Получаем id атрибут нашего контейнера
	get id(): string {
		return this.container.dataset.id || '';
	}
	//Присваиваем текстовый контент элементу отвечающему за заголовок товара карточки с использованием метода setText родительского класса Component
	set title(value: string) {
		//все подобные методы являются методами класса а не конкретного свойства
		this.setText(this._title, value);
	}
	//Получаем текстовый контент элемента отвечающего за заголовок карточки
	get title(): string {
		return this._title.textContent || '';
	}
	//Устанавливаем изображение в элемент отвечающий за изображение нашей карточки
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	//Устанавливаем описание карточки для элемента отвечающего за него. При этом принимаем на вход или строку или массив
	//Это нужно для того если описание состоит более чем из одной строки,то мы создаем новые элементы с описанием. Количество элементов будет равняться количеству элементов массива
	//Метод replaceWith() используется для замены текущего элемента (или списка элементов) другим элементом или набором элементов.
	//Если передаваемые данные - массив, разворачиваем наш массив с помощью spread оператора в качестве аргументов для каждого из которых выполняется клонирование элемента описание а затем присваивается текстовый контент содержащийся в соответствующем элементе массива
	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
	//Устанавливаем текст для кнопки на превью, потому что мы можем как добавить товар в корзину так и убрать его оттуда этой кнопкой
	set button(value: string) {
		this.setText(this._button, value);
	}
	//Устанавливаем цену в качестве текстового контента элементу карточки. Проверяем бесценный товар или нет и в зависимости от результата либо
	//устанавливаем соответствующую цену либо текстовый контент "Бесценно"
	set price(value: number | null) {
		value === null
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value.toString()} синапсов`);
	}
	//Получаем цену товара из текстового контента нашего товара, при этом сразу приводим данные к числового типу
	get price(): number {
		return Number(this._price.textContent) || null;
	}
	//Устанавливаем для элемента отвечающего за отображение количества товара в корзине текстовый контент
	set index(value: string) {
		this._count.textContent = value;
	}
	//Получаем количество товаров в корзине
	get index(): string {
		return this._count.textContent || '';
	}
	//Устанавливаем категорию товара для соответствующего элемента карточки
	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this._category.classList.add(categories[value]);
		}
	}
	//Получаем категорию товара из карточки
	get category() {
		return this._category.textContent || '';
	}
	//Метод который лочит кнопку
	setDisabled() {
		this._button.disabled = true;
	}
}
