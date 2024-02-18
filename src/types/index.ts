// Интерфейс, описывающий карточку товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	count?: string;
	buttonText?: string;
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
	payment: string;
	address: string;
}

export interface IOrdersContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IOrdersDelivery, IOrdersContacts {
	total: number | null;
	items: string[];
}
