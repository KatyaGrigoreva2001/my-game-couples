(function () {
    let timerInterval;
    let remainingTime;
    let timerRunning = false;
    // 1) Создаём число карточек от 4 до 100 и только чётные
    function numberOfCards() {
        let cards = 0;
        let divQuantity = document.querySelector('.button__quantity');
        let divOk = document.querySelector('.button__ok');
        const buttonQuantity = document.createElement('button');
        buttonQuantity.classList.add('btn-reset', 'button-quantity__style');
        const buttonOk = document.createElement('button');
        buttonOk.classList.add('btn-reset', 'button-ok__style');
        buttonOk.textContent = 'Окей!';
        let count = 4;
        function increment() {
            if (count <= 100) {
                buttonQuantity.textContent = count;
                count += 2;
                cards = count - 2;
            } else {
                count = 4;
            }

            console.log(cards);
        }
        increment();
        buttonQuantity.addEventListener('click', increment);
        buttonOk.addEventListener('click', function () {
            buttonQuantity.removeEventListener('click', increment);
            buttonQuantity.disabled = true;
            buttonQuantity.classList.remove('button-quantity__style');
            buttonQuantity.classList.add('button-quantity__disabled');
            buttonOk.disabled = true;
            buttonOk.classList.remove('button-ok__style');
            buttonOk.classList.add('button-ok__disabled');
            shuffleAndCreateCards(cards);
            startTimer(60);
        });
        divQuantity.append(buttonQuantity);
        divOk.append(buttonOk);
    }
    // 2) Создайте функцию, генерирующую массив парных чисел. 
    function createNumbersArray(count) {
        let couples = [];
        for (let i = 1; i <= (count / 2); ++i) {
            couples.push(i);
            couples.push(i);
        }
        console.log(couples);
        return couples;
    }
    // 3) Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив.
    function shuffle(array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        console.log(array);
        return array;
    }

    // 4) создаём карточки 
    function createCards(arr) {
        let divCards = document.querySelector('.cards');
        for (let a of arr) {
            let div = document.createElement('div');
            div.textContent = a;
            div.classList.add('cards-item', 'clickable-div');
            divCards.append(div);
        }
    }

    // 5) Функция для вызова карточек, их сравнения и вызова Победы для перезагрузки 
    function shuffleAndCreateCards(count) {
        const cardsArray = createNumbersArray(count); // Создаем массив чисел
        const shuffledArray = shuffle(cardsArray); // Перемешиваем массив
        createCards(shuffledArray); // Создаем карточки на основе перемешанного массива
        // Получаем массив всех элементов div с классом "clickable-div"
        const clickableDivs = document.querySelectorAll('.clickable-div');
        const targetClass = 'cards-item-correct';
        let clickedDivs = [];
        // Применяет обработчик клика ко всем элементам
        clickableDivs.forEach(function (div) {
            div.addEventListener('click', function () {
                if (!div.classList.contains('cards-item-inverted') && !div.classList.contains('cards-item-correct')) {
                    if (clickedDivs.length < 2) { // Если кликнутых элементов меньше двух
                        div.classList.add('cards-item-inverted');
                        clickedDivs.push(div);
                        if (clickedDivs.length === 2) {
                            if (clickedDivs[0].textContent === clickedDivs[1].textContent) {
                                clickedDivs.forEach(function (clickedDiv) {
                                    clickedDiv.classList.add('cards-item-correct')
                                });
                            }
                        }
                    }
                    if (clickedDivs.length === 2) {
                        setTimeout(function () {
                            clickedDivs.forEach(function (clickedDiv) {
                                clickedDiv.classList.remove('cards-item-inverted');
                            });
                            clickedDivs = [];
                        }, 400)
                    };
                };
                const allElementsHaveClass = [...clickableDivs].every(element => element.classList.contains(targetClass));
                if (allElementsHaveClass) {
                    const victoryMessage = document.querySelector('.victory-message');
                    const playAgainButton = document.getElementById('play-again');
                    const textRestart = document.getElementById('text__restart');
                    textRestart.textContent = 'Вы победили!'
                    victoryMessage.classList.remove('hidden');
                    stopTimer();
                    playAgainButton.addEventListener('click', function () {
                        location.reload();
                    });
                    clearInterval(timerInterval);
                };
            });
        });

    };
    // 6) Функция запускающая таймер
    function startTimer(durationInSeconds) {
        if (timerRunning) {
            clearInterval(timerInterval); // Если таймер уже запущен, остановим его
        }
        remainingTime = durationInSeconds;
        timerRunning = true;
        let timerElement = document.getElementById('timer');
        let timer = durationInSeconds;
        let timerInterval = setInterval(function () {
            if (timerRunning === true) {
                if (timer != 0) {
                    timerElement.textContent = 'Осталось времени: ' + timer + ' секунд';
                    timer--;
                } else {
                    timerElement.textContent = 'Время истекло!';
                    clearInterval(timerInterval);
                    const victoryMessage = document.querySelector('.victory-message');
                    const playAgainButton = document.getElementById('play-again');
                    const textRestart = document.getElementById('text__restart');
                    textRestart.textContent = 'Вы не успели ('
                    victoryMessage.classList.remove('hidden');
                    playAgainButton.addEventListener('click', function () {
                        location.reload();
                    });
                    timerRunning = false;
                }
            }
        }, 1000);
    }
    // 7) функция останавливающая таймер
    function stopTimer() {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        numberOfCards();
    });
})();