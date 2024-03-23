export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Инструментарий для работы с DOM в дочерних компонентах

	// Переключить класс. Передаем элемент с который работаем, имя класса и необязательный аргумент, который является булевым значением
	//если хотим явно указать удалять или добавлять класс у элемента
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Установить текстовое содержимое. Передаем элемент с которым работаем и значение которое будем устанавливать в виде тектового контента
	//значение явно приводит к строковому типу данных
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Сменить статус блокировки.Передаем элемент с которым работаем и булево значение (состояние элемента)
	//Если проходит проверка на существование элемента, то выполняется код удаляющий или добавляющий атрибут disabled у элемента
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть. Передаем элемент который хотим скрыть со страницы.
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать. Передаем элемент который хотим показать на странице
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с альтернативным текстом. Передаем элемент с которым работаем, ссылку на картинку и опционально альтернативный текст
	//Если элемент существует устанавливаем ссылку на картинку, если передали и альтернативный текст устанавливаем и его
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Вернуть корневой DOM-элемент. Мы передаем новые данные для свойств экземпляра класса Component<T>
	//Копируем свойства объекта data  в текущий экземляр класса к которому обращаемся через this.
	//Если в data есть свойства соответствующие экземпляру класса они обновляются
	//return this.container можем получить доступ к элементу для отладки или иных манипуляций
	//синтаксис Object.assign ("объект в который копируем", источник, источник....)
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
