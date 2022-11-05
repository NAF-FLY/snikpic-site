// FLS (Full Logging System) =================================================================================================================
export function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.log(message)
		}
	}, 0)
}

// Проверка браузера на поддержку .webp изображений =================================================================================================================
export function isWebp() {
	// Проверка поддержки webp
	function testWebp(callback) {
		let webP = new Image()
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2)
		}
		webP.src =
			'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebp(function (support) {
		let className = support === true ? 'webp' : 'no-webp'
		document.documentElement.classList.add(className)
	})
}

// Мобильное бургер меню
export function burgerMenu() {
	const burger = document.querySelector('.burger'),
		menu = document.querySelector('.menu'),
		body = document.querySelector('.body'),
		navBtn = document.querySelector('.nav__btn')

	burger.addEventListener('click', () => {
		if (!menu.classList.contains('active')) {
			menu.classList.add('active')
			navBtn.classList.add('active')
			burger.classList.add('active-burger')
			body.classList.add('locked')
		} else {
			menu.classList.remove('active')
			navBtn.classList.remove('active')
			burger.classList.remove('active-burger')
			body.classList.remove('locked')
		}
	})
	// Вот тут мы ставим брейкпоинт навбара
	window.addEventListener('resize', () => {
		if (window.innerWidth > 991.98) {
			menu.classList.remove('active')
			burger.classList.remove('active-burger')
			body.classList.remove('locked')
			navBtn.classList.remove('active')
		}
	})
}

// Функция для фиксированной шапки при скролле =================================================================================================================
export function headerFixed() {
	const header = document.querySelector('.header')
	const firstScreen = document.querySelector('[data-scroll]')

	const headerStickyObserver = new IntersectionObserver(([entry]) => {
		header.classList.toggle('sticky', !entry.isIntersecting)
	})

	if (firstScreen) {
		headerStickyObserver.observe(firstScreen)
	}
}

// Select
const getTemplate = (data = [], placeholder, selectedId) => {
	let text = placeholder ?? 'placeholder не указан'

	const items = data.map(item => {
		let cls = ''
		if (item.id === selectedId) {
			text = item.value
			cls = 'selected'
		}
		return `
      <li class='select__item ${cls}' data-type='item' data-id='${item.id}'>${item.value}</li>
    `
	})
	return `
			<input type="hidden" class="hidden__input">
			<div class="select__backdrop" data-type="backdrop"></div>
			<div class="select__input" data-type="input">
				<span data-type="value">${text}</span>
				<img src="./images/down-arrow.svg" alt="arrow" data-type="arrow" class="select__arrow">
			</div>
			<div class="select__dropdown">
				<ul class="select__list">
					${items.join('')}
				</ul>
			</div>
		`
}

class Select {
	constructor(selector, options) {
		this.$el = document.querySelector(selector)
		this.options = options
		this.selectedId = options.selectedId

		this.render()
		this.setup()
	}

	render() {
		const { placeholder, data } = this.options
		this.$el.classList.add('select')
		this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
	}
	setup() {
		this.clickHandler = this.clickHandler.bind(this)
		this.$el.addEventListener('click', this.clickHandler)
		this.$arrow = this.$el.querySelector('[data-type="arrow"]')
		this.$value = this.$el.querySelector('[data-type="value"]')
	}

	clickHandler(event) {
		const { type } = event.target.dataset
		if (type === 'input') {
			this.toggle()
		} else if (type === 'item') {
			const id = event.target.dataset.id
			this.select(id)
		} else if (type === 'backdrop') {
			this.close()
		}
	}

	get isOpen() {
		return this.$el.classList.contains('open')
	}

	get current() {
		return this.options.data.find(item => item.id === this.selectedId)
	}

	select(id) {
		this.selectedId = id
		this.$value.textContent = this.current.value

		this.$el
			.querySelectorAll(`[data-type='item']`)
			.forEach(el => el.classList.remove('selected'))
		this.$el.querySelector(`[data-id='${id}']`).classList.add('selected')

		this.options.onSelect ? this.options.onSelect(this.current) : null
		this.close()
	}

	toggle() {
		this.isOpen ? this.close() : this.open()
	}

	open() {
		this.$el.classList.add('open')
		this.$arrow.classList.add('open')
	}

	close() {
		this.$el.classList.remove('open')
		this.$arrow.classList.remove('open')
	}

	destroy() {
		this.$el.removEventListener('click', this.clickHandler)
		this.$el.innerHTML = ''
	}
}

// Инициализация плагина
export function selectInit() {
	new Select('#select', {
		placeholder: 'Выберите элемент',
		selectedId: '1',
		data: [
			{ id: '1', value: 'EN' },
			{ id: '2', value: 'UA' },
			{ id: '3', value: 'DE' },
		],
		onSelect(item) {
			const input = document.querySelector('.hidden__input')
			input.value = item.value
		},
	})
}
