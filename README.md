# Проектная работа "Веб-ларек"

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
- `order:submit` - запускает callback, который с помощью Modal.render() и данных класса ContactsForm формирует и отображает модальное окно с формой ввода телефона и адреса электронной почты; на поля ввода вешается слушатель события ввода с клавиатуры, запускающий событие `ordersContacts:changed`, на кнопку закрытия попапа устанавливается слушатель события клика, который закрывает модальное окно, очищая при этом поля ввода формы контактов и формы доставки;
- `order:open` - запускает callback, который с помощью Modal.render() и данных класса PaymentForm формирует и отображает модальное окно с формой ввода адреса доставки и выбора способа оплаты, на кнопки выбора способа оплаты вешается слушатель, запускающий событие `payment:changed`, которое, в свою очередь, записывает выбранный способ оплаты в `AppStatus.order.payment`, на поле ввода вешается слушатель события ввода с клавиатуры, который запускает событие `ordersDelivery:changed`, на кнопку закрытия (крестик) вешается слушатель, который закрывает модальное окно и очищается форму ввода адреса доставки и выбранный способ оплаты;
- `ordersDelivery:changed` - запускает callback, который записывает данные в `AppStatus.order.address`, а так же валидирует поля ввода, на кнопку Далее вешается слушатель сабмита формы, запускающий событие `order:submit` в случае, если валидация поля прошла успешно;
- `basket:open` - запускает callback, который запрашивает у класса AppStatus актуальное состояние корзины, с помощью Modal.render() выводит на экран попап с содежимым корзины, на кнопку Оформить вешается слушатель клика, запускающий событие `ordersDelivery:open`, на кнопку закрытия попапа вешается слушатель клика, по которому попап закрывается;
- `preview:changed` - запускает callback, который берет id карточки, запрашивает по нему всю информацию о выбранном товаре, формирует превью и с помощью Modal.render() выводит на экран попап с выбранным товаром, на кнопку добавления товара в корзину вешается слушатель клика, который в свою очередь, запускает событие `item:check`;
- `item:check` - проверяет есть ли такой товар в корзине, если такого товара нет, то запускается событие `item:add`, который добавляет товар в объект заказа, в противном случае, если такой товар существует, запускается событие `item:delete`, удаляющее товар из корзины;
- `modal:open` - блокирует контент на странице под модальным окном;
- `modal:close` - разблокирует контент на странице под модальным окном;
- `basket:changed` - запускает callback, который запрашивает у класса AppStatus список товаров в корзине, далее, если такого товара в корзине нет, то добавляет этот товар, увеличивает количество товара в корзине (`count:changed`) и общую стоимость корзины (`total`); далее, на кнопку удаления каждого из добавленных товаров устанавливается слушатель клика, который, в свою очередь запускает метод удаления товара из корзины и обновляет общую стоимость корзины;
- `contacts:submit` - запускает callback, отправляющий сформированный объект заказа на сервер и, получив ответ об успешном оформлении заказа, очищает корзину и все формы заказа, сбрасывает состояние выбора способа оплаты и далее запускает событие `success:open`;

### 2. Класс Api

Данный класс осуществляет работу с базовыми запросами к серверу (GET, POST, PUT, DELETE) и занимается обработкой ответов, полученных от сервера.

Класс имеет методы:

- `get` и `post` - для выполнения самх запросов к серверу,
- `handleRespons` - для обработки ответа сервера, его парсинга и обработки ошибок.

### 3. Класс Component

Базовый класс, который наследуется всеми классами, отвечающим за отрисовку интерфейса на экране.

Класс имеет методы:

- `toggleClass` - для переключения класса конкретного DOM-элемента,
- `setText` - для установки текста в свойство textContent конкретного DOM-элемента,
- `setDisabled` - для "отключения" переданного DOM-элемента,
- `setHidden` - для скрытия конкретного DOM-элемента,
- `setVisible` - для показа конкретного DOM-элемента,
- `setImage` - для установки изображения (src) и альтернативного текста (alt) для конкретного DOM-элемента,
- `render` - возвращает container, по которому с помощью метода `replaceChildren` отрисовываются элементы разметки.

### 4. Класс Model

Базовый класс, предназначенный для получения исходных данные которые будут установлены в классы и события, которые будут уведомлять весь окружающий код о том, что что-то будет происходить.

Включает в себя метод:

- `emitChanges` - для сообщения всем подписчикам о том, что модель изменилась.

## Компоненты модели данных

### 1. Класс AppStatus

Класс для хранения данных о товаре, корзине, превью, заказе и ошибках.
Наследуется от класса `Model`.

Методы класса:

- `getTotal` - для вычисления общей суммы товаров в корзине,
- `addItemToBasket` - для добавления конкретного товара в корзину,
- `deleteItemFromBasket` - для удаления конкретного товара из корзины,
- `setItem` - для отрисовки каталога товаров,
- `setPreview` - для открытия предпросмотра товара,
- `setOrderDelivery` - для установки данных по доставке заказа и проверки валидности полей на основе (`checkOrdersValidation`),
- `setOrdersContacts` - для установки данных о контактах и проверки валидности полей на основе (`checkOrdersValidation`),
- `checkOrdersValidation` - для валидации формы заказа и формы контактов покупателя.

## Компоненты представления

### 1. Класс Basket

Данный компонент предназначен для вывода контента в модальном окне Корзины.

Методы класса:

- `set items` - устанавливает содержимое списка товаров в корзине. Если есть товары, заменяет их в списке, в противном случае отображает сообщение о том, что корзина пуста,
- `set enableBtn` - разблокирует кнопку оформления если в корзине имеются товары,
- `set total` - устанавливает стоимость заказа в соответствующем элементе корзины.

### 2. Класс Modal

Компонент, отвечающий за отображение модальных окон и контента в них.

Методы класса:

- `set content` - устанавливает содержимое модального окна, заменяя текущий контент переданным элементом,
- `open` - открывает модальное окно,
- `close` - закрывает модальное окно,
- `render` - отображает модальное окно с данными из передаваемого объекта.

### 3. Класс Form

Компонент, отвечающий за формы приложения.

Методы класса:

- `onInputChange` - вызывается при изменении значения в поле формы,
- `set valid` - устанавливает состояние кнопки отправки формы (активное/не активное),
- `set errors` - валидация форм,
- `render` - вызывается для обновления состояния формы.

### 4. Класс LarekAPI

Компонент, отвечающий за формирование базового адреса сервера для запросов.

Методы класса:

- `getProductList` - гет запрос, который получает список товаров,
- `getProductItem` - гет запрос, который получает конкретный товар по id,
- `orderProducts` - пост запрос, который отправляет данные заказа.

### 5. Класс Page

Компонент, отвечающий за отображении на главной странице контента.

Методы класса:

- `set counter` - устанавливает значение счетчика корзины ,
- `set catalog` - заменяет содержимое элемента каталога переданным массивом элементов,
- `set locked` - для блокировки прокрутки страницы.

### 6. Класс Card

Компонент карточки товара. Основа для остальных компонентов карточек.

Методы класса:

- `set id` - устанавливает идентификатор данных для контейнера ,
- `get id` - возвращает идентификатор данных из контейнера,
- `set title` - устанавливает текст заголовка карточки.
- `get title` - возвращает текст заголовка карточки ,
- `set image` - устанавливает изображение карточки,
- `set description` - устанавливает текст описания карточки.

### 7. Класс BasketCardList

Класс для отображения порядковых нормеров заказов в корзине.

Метод класса:

- `set itemIndex` - устанавливает порядковый номер заказа,

### 8. Класс CatalogItem

Класс отображающий карточку в галерее и на превью.

Методы класса:

- `set category` - устанавливает категорию товара ,
- `set price` - устанавливает цену товара,
- `categoryType` - выбрать категорию для set category.

### 9. Класс PaymentForm

Класс отображающий форму со способом оплаты.

Методы класса:

- `set address` - устанавливает адрес доставки,
- `selectedPaymendMethod` - выбор способа оплаты.

### 10. Класс ContactsForm

Класс отображающий форму c контактами покупателя.

Методы класса:

- `set phone` - устанавливает адрес доставки,
- `set email` - выбор способа оплаты.

### 11. Класс Succses

Класс отображает окно при успешном заказе.

Методы класса:

- `set total` - устанавливливаем соответствующий текст в контейнер.

## Ключевые типы данных.

```TypeScript
// Интерфейс, описывающий карточку товара
export interface ICard {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null,
    count?: string,
    buttonText? : string;
}
//Интерфейс модели данных
export interface IAppStatus {
    catalog: ICard[];
    basket: ICard[];
    preview: string | null;
    delivery: IOrdersDelivery | null;
    contact: IOrdersContacts | null;
    order: IOrder | null;
  }

//Интерфейсы форм оплаты
export interface IOrdersDelivery {
    payment: string,
    address: string,
}

export interface IOrdersContacts {
    email: string,
    phone: string,
}

export interface IOrder extends IOrdersDelivery, IOrdersContacts {
    total: number | null,
    items: string[],
}

//Запросы на сервер
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//Интерфейс успешной оплаты
export interface IOrderSuccess {
	id: string;
	total: number | null;
}

//Ответ от сервера
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

//Методы для Api
export interface ILarekApi {
	getProductList: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	orderProducts: (order: IOrder) => Promise<IOrderSuccess>;
}
```