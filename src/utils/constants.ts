// export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
// export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;
export const settings = {};

export const categories: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	кнопка: 'card__category_button',
	дополнительное: 'card__category_additional',
	другое: 'card__category_other',
};

export const addToBasketText = 'В корзину';
export const removeFromBasketText = 'Убрать из корзины';

export const deliveryFormObj = {
	paymend: '',
	address: '',
};

export const contactsFormObj = {
	email: '',
	phone: '',
};
