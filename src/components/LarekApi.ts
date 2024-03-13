import { Api } from './base/api';
import {
	ApiListResponse,
	ICard,
	ISuccess,
	IOrder,
	ILarekApi,
} from '../types/index';

export class LarekApi extends Api implements ILarekApi {
	//это свойство будет отвечать хранение базового URL для Content Delivery Network (CDN). CDN_URL обычно используется в веб-разработке для формирования полных URL-адресов ресурсов
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		//если в дочернем классе мы определяем свой конструктор, то обычно рекомендуется вызвать конструктор родительского класса, используя ключевое слово super()
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// В TypeScript, когда стрелочная функция состоит из одной строки и возвращает выражение (без использования фигурных скобок), TypeScript автоматически предполагает, что это выражение будет возвращено. Это называется неявным возвращением.
	//Я здесь явно указываю return хотя можно сделать как в ono tebe nado
	getProductList(): Promise<ICard[]> {
		//здесь и далее мы не прописываем у метода get аргументы базового url и опций поскольку данный класс наследует базовый класс Api который в конструкторе уже имеет эти свойства в конструкторе. В этом классе мы вызываем конструктор родительского класса.
		//Фактически когда мы наследуем какой то класс - это образно говоря расширение возможностей базового класса
		return this.get('/product').then((data: ApiListResponse<ICard>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}
	// В данном коде spread оператор используется для создания нового объекта, который является копией объекта item, но с дополнительным свойством image. Это используется для добавления префикса this.cdn к свойству image в объекте item. Таким образом, объект item не изменяется напрямую, а создается новый объект с обновленным свойством image.
	getProduct(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => {
			return {
				...item,
				image: this.cdn + item.image,
			};
		});
	}
	//В методе используется метод post с имплицитным указанием метода 'POST', то есть если мы не указываем третий параметр, то по умолчанию используется method = 'POST'
	postOrderProduct(order: IOrder): Promise<ISuccess> {
		return this.post('/order', order).then((data: ISuccess) => {
			return data;
		});
	}
}
