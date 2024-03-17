// -----------------------------------------------------------БРОКЕР СОБЫТИЙ-----------------------------------------------------------
//имя события у нас либо строка либо регулярное выражение
export type EventName = string | RegExp;
//Необходим для брокера событий когда, мы записываем в объект имя события и коллбэк который этим событием вызван для определенного элемента, что помогает отслеживать события (Паттерн Observer)
export type Subscriber = Function;
//Тип необходим для метода отслеживающий все события, что удобно так как мы можем увидеть все происходящие события и использовать это при отладке кода
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};
//Описываем интерфейс для методов брокера событий
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

// -----------------------------------------------------------ОСНОВНЫЕ ИНТЕРФЕЙСЫ-----------------------------------------------------------

//Описываем интерфейс для карточки
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	//сервер не возвращает нам номер товара, но он понадобиться для отображения в корзине
	count?: number;
}

//Это интерфейс для описания события клика для карточки.onClick это типовое название для события клика. Здесь для аргумента указывается MouseEvent
//MouseEvent - это интерфейс в языке JavaScript, который представляет собой событие мыши в браузере. Он описывает событие, которое происходит, когда пользователь взаимодействует с элементом страницы с помощью мыши, такого как щелчок или перемещение.
// Вот некоторые из свойств и методов MouseEvent: type: строка, указывающая тип события. target: элемент DOM, на котором произошло событие.
// clientX и clientY: координаты курсора мыши относительно окна браузера. button: код кнопки мыши, которая была нажата.
// preventDefault(): метод, который отменяет стандартное действие события, если оно отменяемо, например, открытие ссылки при клике на неё.
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

//Интерфейс для состояния любой формы, с помощью нее мы проверяем валидная она или нет, также здесь есть сообщения для ошибок если такие имеются
export interface IFormState {
	valid: boolean;
	errors: string[];
}

//Интерфейс для формы с адресом доставки и способом оплаты
export interface IDeliveryForm {
	address: string;
	paymend: string;
}

//Интерфейс для формы с почтой и телефоном

export interface IContactsForm {
	phone: string;
	email: string;
}

//Интерфейс для данных покупки

export interface IOrder extends IDeliveryForm, IContactsForm {
	total: number;
	items: string[];
}

//Интерфейс для успешной формы оплаты
export interface ISuccessForm {
	image: string;
	title: string;
	total: number | null;
	description: string;
}

// -----------------------------------------------------------МОДЕЛЬ ДАННЫХ-----------------------------------------------------------

//Этот тип данных будет необходим для валидации форм оплаты и контактов
//ключевое слово keyof используется здесь для получения типа, который представляет все ключи (или свойства) объектного типа IOrder
//Record<K, T>: Это встроенный в TypeScript интерфейс, который создает объектный тип, где ключи имеют тип K, а значения имеют тип T. В данном контексте K - это тип ключа объекта, а T - это тип значения, который в нашем случае является строкой (string).
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Интерфейс для модели данных
export interface IAppStatus {
	catalog: ICard[];
	basket: ICard[];
	delivery: IDeliveryForm | null;
	contacts: IContactsForm | null;
	preview: string | null;
	order: IOrder;
}
// --------------------------------------------------ТИПЫ ДАННЫХ ДЛЯ АПИ------------------------------------------------------
//Типы данных для запросов к АПИ
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

// --------------------------------------------------ИНТЕРФЕЙС ДЛЯ АПИ------------------------------------------------------
export interface ILarekApi {
	getProductList(): Promise<ICard[]>; //получаем  массив товаров(объектов) с сервера
	getProduct(id: string): Promise<ICard>; //получаем конкретный товар с сервера по его id
	postOrderProduct(order: IOrder): Promise<ISuccess>; //отправить на сервер данные покупки и получить ответ
}

//Интерфейс промиса после отправки данных заказа на сервер. У тотала null потому что может быть оформлен бесценный товар
export interface ISuccess {
	id: string;
	total: number | null;
}

// --------------------------------------------------ИНТЕРФЕЙСЫ ДЛЯ КОМПОНЕНТОВ ОТОБРАЖЕНИЯ------------------------------------------------------
//Интерфейс главной страницы. Здесь в каталоге уже не данные а конкретные html элементы в которых уже забиты необходимые данные
//Счетчик у корзины и заблокированный от скролла экран при открытом модальном окне
export interface IPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

//Интерфейс для модальных окон в нем мы также отображаем именно html элемент
export interface IModal {
	content: HTMLElement;
}

//В корзине мы отображаем какое либо количество html элементов то есть наших товаров и общую стоимость товаров
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}
