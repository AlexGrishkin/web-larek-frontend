import { AppState, CatalogChangeEvent } from './components/AppState';
import { Card } from './components/Card';
import { contactsForm } from './components/ContactsForm';
import { deliveryForm } from './components/DeliveryForm';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import './scss/styles.scss';
import { ICard, IContactsForm, IDeliveryForm } from './types';
import {
	API_URL,
	CDN_URL,
	addToBasketText,
	contactsFormObj,
	deliveryFormObj,
	removeFromBasketText,
} from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const deliveryFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const succesOrderTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainerTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');

const dataModel = new AppState({}, events);

const mainPage = new Page(document.body, events);
const modal = new Modal(modalContainerTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryFormContainer = new deliveryForm(
	cloneTemplate(deliveryFormTemplate),
	events,
	{
		onClick: (event: Event) => {
			events.emit('paymend:changed', event.target);
		},
	}
);
const contactsFormContainer = new contactsForm(
	cloneTemplate(contactsFormTemplate),
	events
);

//Осуществляем подписку на событие методом on
//Наполняем каталог главной страницы карточками, данные для которых берутся из модели данных
//Для каждой карточки клонируем контейнер а затем через генерацию события emit уведомляем модель данных что данные карточки изменились
//Все свойства карточки через метод render обновляют свойства текущего экземпляра класса
//Обновляется все в соответствующем контейнере, потому что все элементы инициализированы в контексте контейнера который мы передали в конструктор экземпляра класса
//В данном случае оператор расширения используется для создания копии объекта item. Он распаковывает все свойства из объекта item и создает новый объект с теми же свойствами и их значениями
//на каждую карточку из каталога (на контейнер который передаем в конструктор) навешивается обработчик события card:select. здесь мы уже знаем что каждый item содержит информацию о карточке
//В контексте класса Card, _category является приватным полем, а category может быть реализовано как свойство, которое предоставляет доступ к этому полю через геттеры и сеттеры.
events.on<CatalogChangeEvent>('items:changed', () => {
	mainPage.catalog = dataModel.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			...item,
		});
	});
});

//когда происходит клик по карточке (событие card:select) то мы объект item со всем содержимым передаем в этот код
//Он записывает в поле this.preview dataModel идентификатор текущей карточки и генерирует событие preview:changed передавая ему объект item тем самым подготавливая карточку к выводу на экран
events.on('card:select', (item: ICard) => {
	dataModel.setPreview(item);
});

//Открытие попапа с превью
//Когда все по цепочке произошло, создается темплейт для превью а затем в модальном окне рендерится содержимое текущей карточки
//Здесь также генерится событие item:check и передается объект с данными карточки item - это понадобится для проверки в корзине ли товар
events.on('preview:changed', (item: ICard) => {
	let buttonText;
	let onClickHandler;

	// Проверяем, равна ли цена null
	if (item.price === null) {
		// Если цена равна null, блокируем кнопку и меняем текст
		buttonText = 'Товар не продается';
		onClickHandler = () => {
			// Ничего не делаем при клике на заблокированной кнопке
		};
	} else {
		// Если цена не равна null, используем обычную логику
		buttonText =
			dataModel.basket.indexOf(item) < 0
				? addToBasketText
				: removeFromBasketText;
		onClickHandler = () => {
			events.emit('item:check', item);
			card.button =
				dataModel.basket.indexOf(item) < 0
					? addToBasketText
					: removeFromBasketText;
		};
	}

	// Создаем карточку с соответствующими кнопкой и обработчиком клика
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: onClickHandler,
	});

	// Рендерим модальное окно с карточкой
	modal.render({
		content: card.render({
			button: buttonText,
			...item,
		}),
	});
});

//Проверяем в корзине ли товар
events.on('item:check', (item: ICard) => {
	dataModel.basket.indexOf(item) < 0
		? events.emit('item:add', item)
		: events.emit('item:delete', item);
});

//Добавить в корзину
events.on('item:add', (item: ICard) => {
	dataModel.addItemToBasket(item);
});

//Удалить из корзины
events.on('item:delete', (item: ICard) => {
	dataModel.deleteItemToBasket(item);
});

//Отображаем карточки в корзине
events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:delete', item);
			},
		});
		const cardElement = card.render({
			...item,
		});

		const indexElement = cardElement.querySelector('.basket__item-index');
		if (indexElement) {
			indexElement.textContent = (index + 1).toString();
		}
		return cardElement;
	});

	basket.total = dataModel.getTotal();
	dataModel.order.total = dataModel.getTotal();
});

//Изменение счетчика корзины
events.on('count:changed', () => {
	mainPage.counter = dataModel.basket.length;
});

//Открытие корзины с главной страницы
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

//Отображаем форму с адресом и способом оплаты
events.on('order:open', () => {
	modal.render({
		content: deliveryFormContainer.render({
			valid: false,
			errors: [],
			...deliveryFormObj,
		}),
	});
	dataModel.order.items = dataModel.basket.map((item) => item.id);
});

//Работаем со способом оплаты
events.on('paymend:changed', (target: HTMLButtonElement) => {
	if (!target.classList.contains('button_alt-active')) {
		deliveryFormContainer.tooglePaymendButtons(target);
		dataModel.order.payment = target.getAttribute('name');
		// Проверяем и обновляем состояние формы доставки
		dataModel.validateDeliveryForm();
	}
});

//Работаем с адресом доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IDeliveryForm; value: string }) => {
		dataModel.setDeliveryForm(data.field, data.value);
		dataModel.validateDeliveryForm();
	}
);

//Валидируем форму и разлочиваем кнопку, выводим ошибки если что-то не так
events.on('deliveryForm:changed', (errors: Partial<IDeliveryForm>) => {
	const { payment, address } = errors;
	deliveryFormContainer.valid = !payment && !address;
	deliveryFormContainer.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//Сабмитим данные формы доставки и способа оплаты и отрисовываем следующую форму
events.on('order:submit', () => {
	deliveryFormContainer.clearPaymentSelection();
	modal.render({
		content: contactsFormContainer.render({
			valid: false,
			errors: [],
			...contactsFormObj,
		}),
	});
	dataModel.order.items = dataModel.basket.map((item) => item.id);
});

//Изменения в полях ввода контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		dataModel.setContactsForm(data.field, data.value);
	}
);

//Валидация формы ввода контактов
events.on('contactsForm:changed', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contactsFormContainer.valid = !email && !phone;
	contactsFormContainer.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

//Валидация формы контактов выполнена
events.on('ordersContacts:changed', () => {
	contactsFormContainer.valid = true;
});

//Отправлчем данные заказа на сервер
events.on('contacts:submit', () => {
	api
		.postOrderProduct(dataModel.order)
		.then((result) => {
			dataModel.clearBasket();
			const success = new Success(cloneTemplate(succesOrderTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = result.total.toString();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((error) => {
			console.error(error);
		});
	dataModel.order.payment = '';
	dataModel.order.address = '';
	dataModel.order.email = '';
	dataModel.order.phone = '';
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	mainPage.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	mainPage.locked = false;
});

//Получаем данные с сервера
api
	.getProductList()
	.then(dataModel.setCatalog.bind(dataModel))
	.catch((err) => {
		console.error(err);
	});
