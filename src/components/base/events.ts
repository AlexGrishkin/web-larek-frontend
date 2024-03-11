import { EventName, Subscriber, EmitterEvent, IEvents } from '../../types';

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	/**
	 * Установить обработчик на событие. Передаем имя события обработчик (коллбэк). Если наш Map не имеет этого события
	 * то создает коллекцию уникальных значений Set с именем события и обработчикомю
	 * Если такое событие уже есть в Map, то пытаемся получить набор подписчиков для указанного события (оператор - ?), а затем
	 * добавляем для передаваемого события новый обработчик ['event', 'callback']
	 */
	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	/**
	 * Снять обработчик с события.
	 */
	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	/**
	 * Инициировать событие с данными. Передаем событие и данные с каким-либо типом. Перебираем наш Map и ищем в нем передаваемое событие
	 * Затем перебираем каждого подписчика (обработчик) и вызываем каждый обработчик с переданными данными.
	 * Кстати для Map синтаксис forEach немного другой forEach((value, key map) =>{})
	 */
	emit<T extends object>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	/**
	 * Слушать все события
	 */
	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*', callback);
	}

	/**
	 * Сбросить все обработчики
	 */
	offAll() {
		this._events = new Map<string, Set<Subscriber>>();
	}

	/**
	 * Сделать коллбек триггер, генерирующий событие при вызове.
	 * Передаем имя события и контекстные данные (то есть те данные, которые связаны с событием).
	 * Метод возвращает функцию, который принимает объект (по умолчанию пустой объект). Функция является триггером для события
	 * Вызывает метод эмит текущего экземпляра класса EventEmmiter, он генерирует событие с eventName, и данными которые явлются итогом слияния двух объектов event и context.
	 * Для копирования свойств объектов используется spread оператор - '...'. Копируются в пустой объект {}
	 * Пример { eventType: 'login', timestamp: 123456789, username: 'john_doe', role: 'user' }
	 * Если объекты равны null или undefined, используется пустой объект
	 */
	trigger<T extends object>(eventName: string, context?: Partial<T>) {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}
