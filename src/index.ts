import { AppState, CatalogChangeEvent } from './components/AppState';
import { Card } from './components/Card';
import { contactsForm } from './components/ContactsForm';
import { deliveryForm } from './components/DeliveryForm';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { ICard } from './types';
import { API_URL, CDN_URL } from './utils/constants';
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
	events
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
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', item);
			card.button =
				dataModel.basket.indexOf(item) < 0 ? 'В корзину' : 'Убрать из корзины';
		},
	});

	modal.render({
		content: card.render({
			button:
				dataModel.basket.indexOf(item) < 0 ? 'В корзину' : 'Убрать из корзины',
			...item,
		}),
	});
});

api
	.getProductList()
	.then(dataModel.setCatalog.bind(dataModel))
	.catch((err) => {
		console.error(err);
	});
