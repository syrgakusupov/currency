function getUrl(start = 0) {
    return 'https://api.coinlore.com/api/tickers/?start=' + start + '&limit=10';
}

function getData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => loadDataIntoTable(data))
        .catch(err => console.log(err));
}

function loadDataIntoTable(data) {
    let coinRank = [];
    let coinName = [];
    let coinSymbol = [];
    let coinPrice = [];
    let coin24Change = [];
    let coin7Change = [];

    data['data'].forEach((coin) => {
        coinRank.push(coin.rank);
        coinName.push(coin.name);
        coinSymbol.push(coin.symbol);
        coinPrice.push(coin.price_usd);
        coin24Change.push(coin.percent_change_24h);
        coin7Change.push(coin.percent_change_7d);
    });

    let tableBody = document.getElementById('crypto-table-body');

    let html = "";

    for (let i = 0; i < coinName.length; i++) {
        html += "<tr> <hr/>";
        html += "<td class='rank-text text-darken-4'>" + coinRank[i] + "</td>";
        html += "<td class='name-text text-darken-4'>" + coinName[i] + " (" + coinSymbol[i] + ")" + "</td>";
        html += "<td class='price-text text-darken-4'>$" + coinPrice[i] + "</td>";
        if (coin24Change[i] > 0) {
            html += "<td class='green-text text-darken-4'>+" + coin24Change[i] + "%</td>";
        } else {
            html += "<td class='red-text text-darken-4'>" + coin24Change[i] + "%</td>";
        }


        if (coin7Change[i] > 0) {
            html += "<td class='green-text text-darken-4'>+" + coin7Change[i] + "%</td>";
        } else {
            html += "<td class='red-text text-darken-4'>" + coin7Change[i] + "%</td>";
        }

        html += "</tr>";
    }

    tableBody.innerHTML = html;
}

function handleNumberClick(clickedLink, leftArrow, rightArrow) {
    clickedLink.parentElement.classList = "active";
    let clickedLinkPageNumber = parseInt(clickedLink.innerText);
    const url = getUrl((clickedLinkPageNumber * 10) - 10);
    getData(url);

    switch (clickedLinkPageNumber) {
        case 1:
            disableLeftArrow(leftArrow);
            if (rightArrow.className.indexOf('disabled') !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
        case 10:
            disableRightArrow(rightArrow);
            if (leftArrow.className.indexOf('disabled') !== -1) {
                enableLeftArrow(leftArrow);
            }
            break;
        default:
            if (leftArrow.className.indexOf('disabled') !== -1) {
                enableLeftArrow(leftArrow);
            }
            if (rightArrow.className.indexOf('disabled') !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
    }
}

function handleLeftArrowClick(activePageNumber, leftArrow, rightArrow) {
    let previousPage = document.querySelectorAll('li')[activePageNumber - 1];
    previousPage.classList = "active";
    url = getUrl(((activePageNumber - 1) * 10) - 10);
    getData(url);

    if (activePageNumber === 10) {
        enableRightArrow(rightArrow);
    }

    if (activePageNumber - 1 === 1) {
        disableLeftArrow(leftArrow);
    }
}

function handleRightArrowClick(activePageNumber, leftArrow, rightArrow) {
    let nextPage = document.querySelectorAll('li')[activePageNumber + 1];
    nextPage.classList = "active";

    url = getUrl(((activePageNumber + 1) * 10) - 10);
    getData(url);

    if (activePageNumber === 1) {
        enableLeftArrow(leftArrow);
    }

    if (activePageNumber + 1 === 10) {
        disableRightArrow(rightArrow);
    }
}

function disableLeftArrow(leftArrow) {
    leftArrow.classList = "disabled arrow-left";
}

function enableLeftArrow(leftArrow) {
    leftArrow.classList = "waves-effect arrow-left";
}

function disableRightArrow(rightArrow) {
    rightArrow.classList = "disabled arrow-right";
}

function enableRightArrow(rightArrow) {
    rightArrow.classList = "waves-effect arrow-right";
}

function init() {
    const url = getUrl();
    getData(url);
}

init();

let pageLinks = document.querySelectorAll('a');
let activePageNumber;
let clickedLink;
let leftArrow;
let rightArrow;
let url = '';

pageLinks.forEach((element) => {
    element.addEventListener("click", function () {
        leftArrow = document.querySelector('.arrow-left');
        rightArrow = document.querySelector('.arrow-right');
        console.log(rightArrow);
        activeLink = document.querySelector('.active');

        activePageNumber = parseInt(activeLink.innerText);

        if ((this.innerText === 'chevron_left' && activePageNumber === 1) || (this.innerText === 'chevron_right' && activePageNumber === 10)) {
            return;
        }

        activeLink.classList = "waves-effect";

        if (this.innerText === 'chevron_left') {
            handleLeftArrowClick(activePageNumber, leftArrow, rightArrow);
        } else if (this.innerText === 'chevron_right') {
            handleRightArrowClick(activePageNumber, leftArrow, rightArrow);
        } else {
            handleNumberClick(this, leftArrow, rightArrow);
        }

    });
});

const input_currency = document.querySelector('#input_currency');
const output_currency = document.querySelector('#output_currency');
const input_amount = document.querySelector('#input_amount');
const output_amount = document.querySelector('#output_amount');
const rate = document.querySelector('#rate');
const mapp = document.querySelector('#mapp');

input_currency.addEventListener('change', compute);
output_currency.addEventListener('change', compute);
input_amount.addEventListener('input', compute);
output_amount.addEventListener('input', compute);


function compute() {
    const input_currency1 = input_currency.value;
    const output_currency1 = output_currency.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${input_currency1}`)
        .then(res => res.json())
        .then(res => {
            // console.log(res);
            const new_rate = res.rates[output_currency1];
            rate.innerText = `1 ${input_currency1} =  ${new_rate} ${output_currency1}`
            output_amount.value = (input_amount.value * new_rate).toFixed(2);
            // console.log(res);
        })
}

compute();

/**Запрос для получения валюты * */

document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('https://v6.exchangerate-api.com/v6/a9ee452403364fa939969ff3/latest/USD')
    const data = await response.json()
    return showData(data)
});

document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('https://v6.exchangerate-api.com/v6/a9ee452403364fa939969ff3/latest/RUB')
    const data = await response.json()
    return showRub(data)
});

const showData = (data) => {
    let display = document.getElementById('description-currency')
    let show = ''

    show += `<td class='rank-text text-darken-4'>${data.base_code}</td>`
    show += `<td class='rank-text text-darken-4'>${data.conversion_rates.AED}</td>`
    show += `<td class='rank-text text-darken-4'>${data.conversion_rates.USD}</td>`

    display.innerHTML = show
}

const showRub = (data) => {
    let display = document.getElementById('description-currencyRub')
    let show = ''

    show += `<td class='rank-text text-darken-4'>${data.base_code}</td>`
    show += `<td class='rank-text text-darken-4'>${data.conversion_rates.AED}</td>`
    show += `<td class='rank-text text-darken-4'>${data.conversion_rates.USD}</td>`
    display.innerHTML = show
}