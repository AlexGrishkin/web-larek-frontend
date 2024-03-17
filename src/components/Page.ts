import { Component } from './base/Component';
import { IEvents, IPage } from '../types/index';
import { ensureElement } from '../utils/utils';

//Этот класс отвечает за отображении всех элементов на главной странице
export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		//Конструктор родительского класса Component принимает контейнер элемента с которым работаем
		super(container);
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		//Поскольку в конструкторе у нас происходит инициализация элементов, целесообразно сразу на этом этапе присвоить обработчик корзине, чтобы можно было сразу работать с элементом корзины после создания эксземпляра класса
		//Здесь не передаются данные в метод emit, потому что это делается в момент возникновения события, а не в момент создания экземпляра класса.
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		//Поскольку setText метод класса, то мы ссылаемся на экземпляр класса(объект) в котором находятся соответствующее свойство _counter, с которым мы совершаем определенное действие
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		//Метод replaceChildren заменяет всех потомков элемента _catalog указанными элементами. В данном случае, spread оператор  ... используется для передачи всех элементов массива items в качестве аргументов методу replaceChildren. Это позволяет заменить текущие дочерние элементы каталога на новые элементы из массива items.
		//Механика метода parentElement.replaceChildren(newChild1, newChild2, ...); Этот метод удаляет все существующие дочерние элементы parentElement и заменяет их новыми элементами, переданными в качестве аргументов.
		this._catalog.replaceChildren(...items);
	}
	//Устанавливает или удаляет класс 'page__wrapper_locked' у обертки страницы (_wrapper) в зависимости от значения value. Если value равно true, добавляется класс, если value равно false, класс удаляется.
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
