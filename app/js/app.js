const dropdown = document.getElementById('dropdown_city')
const choice_city = document.getElementById('choice_city')
const city_list = document.getElementById('city-list')
const select_city_block = document.getElementById('select-city-block')
const search_city_input = document.getElementById('search-city-input')
const close_search_city = document.getElementById('close-search-city')
const city_visible = document.getElementById('city-visible')
let nameCityArg = []
let cityData = []
let sendDATA = []

function init() {
    headerSwiperMenu()
    requestListCity()
    cleanInputSearchCity()
   
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
                .catch((err) => console.log('ошибка ' + err))

            cityData = responseCityList
            console.log('response', cityData)

            cityData.map((state) => {
                nameCityArg.push({name:state.name, id: state.id})
                if (state.cities != undefined) {
                    state.cities.map((city) => {
                        nameCityArg.push({name:city.name, id: city.id, state: state.name})
                    })
                }
            })
            formationListCity(nameCityArg)
            searchCity(nameCityArg)
        }



        dropdown.classList.toggle('header__top__city__dropdown--active')
    })
}

function formationListCity(nameArgCityList, render) {
    
    if (render) {
        city_list.innerHTML = ''
    }
    
    nameArgCityList.map(el => {
        let newDivItemListCity = document.createElement('div')
        newDivItemListCity.classList.add('header__top__city__dropdown__list__item')
        newDivItemListCity.setAttribute('data-id', el.id)

        if(!el.state) {
            newDivItemListCity.textContent = el.name
        } else {
            let newSpanItemListCity = document.createElement('span'),
                newSpanItemListState = document.createElement('span')
            newSpanItemListState.classList.add('header__top__city__dropdown__list__item__state')
            newSpanItemListCity.textContent = el.name
            newSpanItemListState.textContent = el.state
            newDivItemListCity.append(newSpanItemListCity)
            newDivItemListCity.append(newSpanItemListState)
        }
        city_list.append(newDivItemListCity)
    })


    const prevSelectListCity = document.querySelectorAll(
        '#city-list .header__top__city__dropdown__list__item'
    )

    selectCity(prevSelectListCity)
    
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
            updateSelectDATA()
        })
    }
}

function deleteSelect(argCrossDel) {
    for (let i = 0; i < argCrossDel.length; i++) {
        argCrossDel[i].addEventListener('click', function () {
            this.parentElement.remove()
            updateSelectDATA()
        })
    }
}

function searchCity(argSearch) {
    if(!argSearch) return
    search_city_input.addEventListener('input', function () {
        if (search_city_input.value.length > 0) {
            close_search_city.classList.add('header__top__city__dropdown__search__exit--active')
            let argSearchNew = []

            for (let i = 0; i < argSearch.length; i++) {
                if (argSearch[i].name.match(RegExp('^' + search_city_input.value.toLowerCase(), 'i'))) {
                    argSearchNew.push(argSearch[i])
                }
            }


            formationListCity(argSearchNew, true)

        } else {
            close_search_city.classList.remove('header__top__city__dropdown__search__exit--active')
        }
    })
}


function cleanInputSearchCity() {
    close_search_city.addEventListener('click', function() {
        search_city_input.value = ''
    })
}


function updateSelectDATA() {
    



    // let tempSendDATA = document.querySelectorAll('.header__top__city__dropdown__select__item')

    // console.log('tempSendDATA', tempSendDATA)
    // for (let i = 0; i < tempSendDATA.length; i++) {
    //     let tmpEl = tempSendDATA[i].textContent
    //     sendDATA += tmpEl
    // }
    // console.log('sendDATA', sendDATA)
}

function cityVisible() {
    // city_visible.textContent
}