import {
	IAppStatus,
	ICard,
	IDeliveryForm,
	IContactsForm,
	IOrder,
	FormErrors,
} from '../types/index';

import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class AppState extends Model<IAppStatus> {
	catalog: ICard[];
	basket: ICard[] = [];
	preview: string | null;
	//Почему мы не прописали просто order: IOrder ? Потому что в этом случае, свойство order будет иметь тип IOrder, но будет иметь значение undefined, если мы не инициализируем его в конструкторе или в другом месте.
	//В коде я инициализирую order объектом типа IOrder, устанавливая начальные значения свойств этого объекта. Такая инициализация предоставляет  гарантию, что объект order будет иметь все необходимые свойства address, payment, phone, email, total и items, и они будут иметь соответствующие начальные значения.
	order: IOrder = {
		address: '',
		payment: '',
		phone: '',
		email: '',
		total: 0,
		items: [],
	};
	formErrors: FormErrors = {};

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	//Когда отправляется событие, которое сообщает о изменении конкретного состояния или объекта, хорошей практикой является явное указание, что именно изменилось. В данном случае, события передавались в виде объекта { basket: this.basket }, чтобы получатели могли точно знать, что именно изменилось - в данном случае, это состояние корзины.
	addItemToBasket(item: ICard) {
		this.basket.indexOf(item) < 0 ? this.basket.push(item) : false;
		this.emitChanges('basket:changed', this.basket);
		this.emitChanges('count:changed', this.basket);
	}

	//Здесь находим в нашем массиве корзины элемент который хотим удялять находим его индекс через indexOf и удаляем из массива методом splice
	deleteItemToBasket(item: ICard) {
		const index = this.basket.indexOf(item);
		this.basket.splice(index, 1);
		this.emitChanges('basket:changed', this.basket);
		this.emitChanges('count:changed', this.basket);
	}

	//Высчитываем общую стоимость товаров, важно здесь точно удостоверится что item это объект типа ICard
	//return перед вызовом reduce обязателен, потому что он указывает на то, что метод getTotal должен вернуть результат работы метода reduce, который в свою очередь возвращает сумму всех цен товаров в корзине.
	getTotal() {
		return this.basket.reduce((acc, item: ICard) => {
			return acc + item.price;
		}, 0);
	}
	//Очищаем корзину когда отправили данные заказа на сервер
	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', this.basket);
		this.emitChanges('count:changed', this.basket);
	}

	// В методе setPreview, когда вызывается emitChanges('preview:changed', item), предполагается, что элемент item содержит всю необходимую информацию о предварительном просмотре, включая его идентификатор (id). Поэтому нет необходимости передавать { preview: this.preview } в качестве данных события.
	// Однако, если объект item не содержит всей необходимой информации о предварительном просмотре, и свойство preview содержит какую-то дополнительную информацию, которая должна быть передана вместе с предварительным просмотром, то в этом случае использование { preview: this.preview } могло бы быть целесообразным.
	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
	//Заполняем форму доставки и сопосба оплаты, а также валидируем поля ввода, если валидация успешна, то уведомляем подписчиков о изменении модели
	//То есть здесь по факту метод присваивает соответсвующему свойству объекта this.order значение, введенное в соответсвующее поле формы и затем validateDeliveryForm() проверяет действительно ли это поле заполнено или нет
	//keyof IDeliveryForm будет представлять собой тип, который содержит все ключи этого объекта, то есть address | paymend
	setDeliveryForm(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
	}

	//Валидируем форму доставки и способа оплаты
	validateDeliveryForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адресс';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:changed', this.formErrors);
		this.events.emit('deliveryForm:changed', this.formErrors);
		console.log(this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//Аналогично форме доставки, только здесь для формы контактных данных
	setContactsForm(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		if (this.validateContactsForm()) {
			this.events.emit('contactsForm:changed', this.formErrors);
		}
	}

	//Валидируем форму контактных данных
	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.email) {
			errors.email = 'Необходимо указать почту';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:changed', this.formErrors);
		this.events.emit('contactsForm:changed', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
