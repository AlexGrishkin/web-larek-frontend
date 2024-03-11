import { ApiPostMethods } from '../../types';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	//Здесь происходит инициализация свойств класса. Для this.baseUrl мы используем данные передаваемые в конструкторе baseUrl
	//Для заголовков this.options используем свойство headers передаваемого в конструкторе объекта options
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	//Проверяем ответ от сервера. Если промис завершился успешно то получаем объект представляющий собой данные json
	//Так как response.json тоже промис, то при ошибке создаем отклоненный промис в блоке tnen.
	//Не используем catch поскольку в этом месте отклонение промиса явно указывается, блок catch не станет активным, поскольку он срабатывает только для необработанных ошибок (произошедших в предыдущем звене цепочки then)
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	//Гет запрос, который использует свойство baseUrl текущего экземпляра класса, дополнительный путь, заголовки из свойства options текущего экземпляра класса и проверяет ответ от сервера при помощи handleresponse
	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	//Пост запрос берет все теже исходники юрл и заголовки. Но сюда мы уже передаем объект который будем отправлять на сервер и явно указываем пост метод указанный в типе данных ApiPostMethods
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
