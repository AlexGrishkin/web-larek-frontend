# Проектная работа "Веб-ларек"

https://github.com/AlexGrishkin/web-larek-frontend.git

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/ba`se`/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код

### 1. Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Класс имеет методы:

- `on` - для подписки на событие,
- `off` - для отписки от события,
- `emit` - для уведомления подписчиков о наступлении события соответственно,
- `onAll` - для подписки на все события,
- `offAll` - для сброса всех подписчиков,
- `trigger` - для осуществления коллбек триггера, генерирующего событие при вызове.

События, обрабатываемые классом `EventEmitter`:

- `items:changed` - запускает callback, который формирует карточки товаров (`Card`); на каждую из карточек устанавливается обработчик события `card:select`;
- `card:select` - запускает callback, вызывающий метод `setPreview`, который, в свою очередь, запускает обработчик события `preview:changed`;
- `preview:changed` - запускает callback, который берет id карточки, запрашивает по нему всю информацию о выбранном товаре, формирует превью и с помощью Modal.render() выводит на экран попап с выбранным товаром, на кнопку добавления товара в корзину вешается слушатель клика, который в свою очередь, запускает событие `item:check`;
- `item:check` - проверяет есть ли такой товар в корзине, если такого товара нет, то запускается событие `item:add`, который добавляет товар в объект заказа, в противном случае, если такой товар существует, запускается событие `item:delete`, удаляющее товар из корзины;
- `order:submit` - запускает callback, который с помощью Modal.render() и данных класса ContactsForm формирует и отображает модальное окно с формой ввода телефона и адреса электронной почты; на поля ввода вешается слушатель события ввода с клавиатуры, запускающий событие `ordersContacts:changed`, на кнопку закрытия попапа устанавливается слушатель события клика, который закрывает модальное окно, очищая при этом поля ввода формы контактов и формы доставки;
- `basket:changed` - запускает callback, который запрашивает у класса модели данных список товаров в корзине, далее, если такого товара в корзине нет, то добавляет этот товар, увеличивает количество товара в корзине (`count:changed`) и общую стоимость корзины; далее, на кнопку удаления каждого из добавленных товаров устанавливается слушатель клика, который, в свою очередь запускает метод удаления товара из корзины;
- `basket:open` - запускает callback, который запрашивает у класса AppStatus актуальное состояние корзины, с помощью Modal.render() выводит на экран попап с содежимым корзины
- `order:open` - запускает callback, который с помощью Modal.render() и данных класса deliveryForm формирует и отображает модальное окно с формой ввода адреса доставки и выбора способа оплаты, на кнопки выбора способа оплаты вешается слушатель, запускающий событие `payment:changed`, которое, в свою очередь, записывает выбранный способ оплаты в модель данных, на поле ввода вешается слушатель события ввода с клавиатуры.
- `deliveryForm:changed` - запускает callback, который валидирует форму с адресом и способом оплаты и выводит ошибки, на кнопку Далее вешается слушатель сабмита формы, запускающий событие `order:submit` в случае, если валидация поля прошла успешно;
- `modal:open` - блокирует контент на странице под модальным окном;
- `modal:close` - разблокирует контент на странице под модальным окном;
- `contacts:submit` - запускает callback, отправляющий сформированный объект заказа на сервер и, получив ответ об успешном оформлении заказа, очищает корзину и все формы заказа, и далее запускает событие `success:open`;

### 2. Класс Api

Данный класс осуществляет работу с базовыми запросами к серверу (GET, POST, PUT, DELETE) и занимается обработкой ответов, полученных от сервера.

Класс имеет методы:

- `get` и `post` - для выполнения самих запросов к серверу, get - получаем что-то с сервера, post - отправляем что-то на сервер
- `handleRespons` - для обработки ответа сервера, извлечения из него необходимой информации.

### 2.1. Класс LarekAPI

Компонент, отвечающий за формирование базового адреса сервера для запросов. Наследуется от `Api`.

Методы класса:

- `getProductList` - гет запрос, который получает список товаров,
- `getProduct` - гет запрос, который получает конкретный товар по id,
- `postOrderProduct` - пост запрос, который отправляет данные заказа.

### 3. Класс Component<T>

Базовый класс, который наследуется всеми классами, отвечающими за слой view(отображение).

Класс имеет методы:

- `toggleClass` - для переключения класса конкретного DOM-элемента,
- `setText` - для установки текста в свойство textContent конкретного DOM-элемента,
- `setDisabled` - для "отключения" переданного DOM-элемента с помощью атрибута disabled,
- `setHidden` - для скрытия конкретного DOM-элемента,
- `setVisible` - для показа конкретного DOM-элемента,
- `setImage` - для установки изображения (src) и альтернативного текста (alt) для конкретного DOM-элемента,
- `render` - метод для обновления свойств экземпляра класса (контент всех элементов обновляется с помощью этого метода).

### 4. Класс Model<T>

Базовый класс, предназначенный для уведомления подписчиков на определенные события, что данные изменились и им нужно использовать их для своих операций.

Включает в себя метод:

- `emitChanges` - для сообщения всем подписчикам о том, что модель изменилась.

## Компоненты модели данных

### 1. Класс AppState

Класс для хранения данных о товаре, корзине, превью, заказе и ошибках.
Наследуется от класса `Model`.

Методы класса:

- `setCatalog` - метод для передачи данных карточек в каталог товаров.
- `addItemToBasket` - для добавления конкретного товара в корзину,
- `deleteItemToBasket` - для удаления конкретного товара из корзины,
- `getTotal` - для вычисления общей суммы товаров в корзине,
- `clearBasket` - очищаем корзину когда отправили данные заказа на сервер,
- `setPreview` - для подготовки данных карточки для предпросмотра,
- `setDeliveryForm` - для установки данных по доставке заказа,
- `validateDeliveryForm` - валидация формы заказа,
- `setContactsForm` - для установки данных о контактах и проверки валидности полей на основе (`checkOrdersValidation`),
- `validateContactsForm` - для валидации контактов покупателя.

## Компоненты представления

### 1. Класс Basket

Данный компонент предназначен для вывода контента в модальном окне Корзины. Наследуется от `Component`.

Методы класса:

- `set items` - устанавливает содержимое списка товаров в корзине. Если есть товары, заменяет их в списке, в противном случае отображает сообщение о том, что корзина пуста,
- `set total` - устанавливает общую стоимость заказа в соответствующем элементе корзины.

### 2. Класс Modal

Компонент, отвечающий за отображение модальных окон и контента в них.Наследуется от `Component`

Методы класса:

- `set content` - устанавливает содержимое модального окна, заменяя текущий контент переданным элементом,
- `open` - открывает модальное окно,
- `close` - закрывает модальное окно,
- `render` - отображает модальное окно с данными из передаваемого объекта.

### 3. Класс Form

Компонент, отвечающий за формы приложения.Наследуется от `Component`

Методы класса:

- `onInputChange` - вызывается при изменении значения в поле формы, несет в себе имя поля с которым работаем и значение которые будем устанавливать в объект необходимый при генерации события,
- `set valid` - блокирует или активирует кнопку в форме посредством атрибута disabled, если та не прошла валидацию,
- `set errors` - устанавливает текст ошибки валидации в соответствующий элемент чтобы пользователь увидел что не так,
- `render` - вызывается для обновления состояния формы на основании объекта с данными.

### 4. Класс Page

Компонент, отвечающий за отображении на главной странице контента.

Методы класса:

- `set counter` - устанавливает значение счетчика корзины ,
- `set catalog` - заменяет содержимое элемента каталога переданным массивом элементов,
- `set locked` - для блокировки прокрутки страницы.

### 5. Класс Card

Компонент карточки товара. Основа для остальных компонентов карточек.

Методы класса:

- `set id` - устанавливает идентификатор данных для контейнера ,
- `get id` - возвращает идентификатор данных из контейнера,
- `set title` - устанавливает текст заголовка карточки.
- `get title` - возвращает текст заголовка карточки ,
- `set image` - устанавливает изображение карточки,
- `set description` - устанавливает текст описания карточки.
- `set button` - устанавливаем текст для кнопки на превью, потому что мы можем как добавить товар в корзину так и убрать его оттуда этой кнопкой.
- `set price` - Устанавливаем цену в качестве текстового контента элементу карточки. Проверяем бесценный товар или нет и в зависимости от результата либо устанавливаем соответствующую цену либо текстовый контент "Бесценно".
- `get price` - получаем цену товара из текстового контента нашего товара, при этом сразу приводим данные к числовому типу,
- `set index` - Устанавливаем для элемента отвечающего за отображение номера в корзине текстовый контент,
- `get index` - Получаем номер товара в корзине,
- `set category` - Устанавливаем категорию товара для соответствующего элемента карточки,
- `get category` - Получаем категорию товара из карточки.

### 6. Класс deliveryForm

Класс отображающий форму со способом оплаты.

Методы класса:

- `set address` - устанавливает адрес доставки,
- `tooglePaymendButtons` - добавляет селектор активной кнопки одной из выбранных кнопок способа оплаты,
- `clearPaymentSelection` - удаляем селектор активной кнопки после того как завершили работу с формой оплаты и адреса.

### 7. Класс contactsForm

Класс отображающий форму c контактами покупателя.

Методы класса:

- `set phone` - устанавливает адрес доставки,
- `set email` - выбор способа оплаты.

### 8. Класс Succses

Класс отображает окно при успешном заказе.

Методы класса:

- `set total` - устанавливливаем соответствующий текст в контейнер.

## Ключевые типы данных.

```TypeScript
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
	button?: string;
}

//Это интерфейс для описания события клика для карточки.onClick это типовое название для события клика. Здесь для аргумента указывается MouseEvent
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
	payment: string;
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

//Этот тип данных будет необходим для валидации форм оплаты и контактов, а именно для ошибок которые мы будем выводить
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

//Типы данных для запросов к АПИ
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

//Интерфейс для необходмых гет и пост запросов на сервер
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

export interface ISuccessActions {
	onClick: () => void;
}

//Интерфейс главной страницы. Здесь в каталоге уже не данные а конкретные html элементы
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
```
