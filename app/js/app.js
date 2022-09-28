const dropdown = document.getElementById('dropdown_city')
const choice_city = document.getElementById('choice_city')
const city_list = document.getElementById('city-list')
const select_city_block = document.getElementById('select-city-block')
const search_city_input = document.getElementById('search-city-input')
let nameCityArg = []
let cityData = []

function init() {
    headerSwiperMenu()
    requestListCity()
}

init()

function headerSwiperMenu() {
    const swiper = new Swiper('.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 9,
        spaceBetween: 30,
        freeMode: {
            enabled: true,
            sticky: true,
        },
        // breakpoints: {
        //     769: {
        //         slidesPerView: 2,
        //         slidesPerGroup: 2,
        //     },
        // },
    })
    swiper.on('click', function () {
        for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].classList.remove('active-el')
            swiper.slides[i].addEventListener('click', function () {
                this.classList.add('active-el')
            })
        }
    })
}

function requestListCity() {
    choice_city.addEventListener('click', async function () {
        if (cityData.length == 0) {
            const responseCityList = await fetch(
                'https://studika.ru/api/areas',
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                }
            )
                .then((response) => {
                    if (response.status !== 200) {
                        return Promise.reject()
                    }
                    return response.json()
                })
                .catch((err) => console.log('ошибка' + err))

            cityData = responseCityList
            console.log('response', cityData)

        }
        
        updateCityList()

        dropdown.classList.toggle('header__top__city__dropdown--active')
    })
}

function updateCityList() {
    cityData.map((state) => {
        let newDivState = document.createElement('div')
        newDivState.classList.add('header__top__city__dropdown__list__item')
        newDivState.setAttribute('data-id', state.id)
        newDivState.innerHTML = state.name
        nameCityArg.push(state.name)
        city_list.append(newDivState)
        if (state.cities != undefined) {
            state.cities.reverse().map((city) => {
                let newDivCity = document.createElement('div')
                newDivCity.classList.add(
                    'header__top__city__dropdown__list__item'
                )
                newDivCity.setAttribute('data-id', city.id)
                nameCityArg.push(city.name)
                newDivCity.innerHTML += `<span>${city.name}</span><span class="header__top__city__dropdown__list__item__state">${state.name}</span>`
                newDivState.after(newDivCity)
            })
        }
    })


    const prevSelectListCity = document.querySelectorAll(
        '#city-list .header__top__city__dropdown__list__item'
    )


    selectCity(prevSelectListCity)
    searchCity(nameCityArg)
}

function selectCity(arg) {
    for (let i = 0; i < arg.length; i++) {
        arg[i].addEventListener('click', function () {
            let newSelectCity = document.createElement('div')
            newSelectCity.classList.add(
                'header__top__city__dropdown__select__item'
            )

            let selectCityArg = document.querySelectorAll(
                '.header__top__city__dropdown__select__item'
            )

            for (let i = 0; i < selectCityArg.length; i++) {
                if (
                    selectCityArg[i].getAttribute('select-id') ==
                    this.getAttribute('data-id')
                ) {
                    selectCityArg[i].remove()
                    return
                }
            }

            if (this.children.length == 0) {
                newSelectCity.setAttribute(
                    'select-id',
                    this.getAttribute('data-id')
                )
                newSelectCity.innerHTML = `${this.textContent}<i class="fa-solid fa-xmark header__top__city__dropdown__select__item__cross"></i>`
            } else {
                newSelectCity.setAttribute(
                    'select-id',
                    this.getAttribute('data-id')
                )
                newSelectCity.innerHTML = `${this.children[0].textContent}<i class="fa-solid fa-xmark header__top__city__dropdown__select__item__cross"></i>`
            }

            select_city_block.append(newSelectCity)

            let crossArg = document.querySelectorAll(
                '.header__top__city__dropdown__select__item .header__top__city__dropdown__select__item__cross'
            )

            if (crossArg.length > 0) deleteSelect(crossArg)
        })
    }
}

function deleteSelect(argDel) {
    for (let i = 0; i < argDel.length; i++) {
        argDel[i].addEventListener('click', function () {
            this.parentElement.remove()
        })
    }
}

function searchCity(argSearch) {
    search_city_input.addEventListener('input', function () {
        if (search_city_input.value.length > 0) {
            for (let i = 0; i < argSearch.length; i++) {
                let current1 = argSearch[i].split('')
                
                (function(i) {
                for (let iw = 0; iw < current1.length; iw++) {
                    if(search_city_input.value.length == 1) {
                        if(search_city_input.value == current1[iw])
                        console.log('совпадение', current1[iw],argSearch[i])
                    }
                }
                })(i)

                
                
            
            }
        }
    })
}
