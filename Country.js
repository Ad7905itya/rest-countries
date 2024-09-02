const countryName = new URLSearchParams(window.location.search).get('name');
const colorTheme = document.querySelector('.colorTheme');
const body = document.querySelector('body');
let mode = 'light';

window.addEventListener('load',()=>{
    body.classList.add(`${localStorage.getItem('colorTheme')}`);
    colorTheme.children[0].classList.add(`${localStorage.getItem('modeIcon') || 'fa-moon'}`)
})

colorTheme.addEventListener('click',()=>{
    if(body.classList.contains('dark')){
        body.classList.remove('dark');
        colorTheme.children[0].classList.replace('fa-sun','fa-moon')
        colorTheme.children[1].innerText = mode + ' mode';
        mode = 'light';
        localStorage.setItem('colorTheme',mode)
        localStorage.setItem('modeIcon','fa-moon')
    }else{
        body.classList.add('dark');
        colorTheme.children[0].classList.replace('fa-moon','fa-sun')
        colorTheme.children[1].innerText = mode + ' mode';
        mode = 'dark';
        localStorage.setItem('colorTheme',mode)
        localStorage.setItem('modeIcon','fa-sun')
    }
})

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`).then(res => res.json())
    .then((allData) => {
        const NewData = [...allData.map((data) => {
            return data
        })]
        receiveData(NewData);
    })

const countryDetailContent = document.querySelector('.country-Detail-content');

function receiveData(data) {
    countryDetailContent.innerHTML = data.map((data) => {
        let { name, population, region, flags, capital, subregion, tld, languages, currencies,borders } = data;

        function nameValue(nativeValue) {
            if (!!name.nativeName) {
                nativeValue = Object.values(name.nativeName)[0].common;

                return nativeValue
            } else {
                nativeValue = name.common;
                return nativeValue
            }
        }
        function currencyValue(currency) {
            if (!!currencies) {
                const currenciesValue = Object.values(currencies);
                currency = currenciesValue.map((currency) => {
                    return currency.name
                });
                return currency
            } else {
                currency = '';
                return currency
            }
        }
        function languagesValue(language) {
            if (!!languages) {
                language = Object.values(languages);
                return language
            } else {
                language = '';
                return language
            }
        }

        if(!!borders){
        function bordersCountry(borders) {
            borders.map((border) => {
                fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then(res => res.json())
                .then(([data]) => {
                    const anchor = document.createElement('a');
                    anchor.innerHTML = data.name.common;
                    anchor.href = `./country.html?name=${data.name.common}`;
                    borderCountry.append(anchor)
                })
            })
        }
        bordersCountry(borders)
    }

        return (
            `<div class="image-section">
            <img src=${flags.svg} alt="">
            </div>
            <div class="country-content">
            <h1>${name.common}</h1>
            <div class="flex-content">
            <div class="left-content">
            <p><b>Native Name: </b><span>
            ${nameValue()}</span></p>
            <p><b>Population: </b><span>${population.toLocaleString('en-IN')}</span></p>
            <p><b>Region: </b><span>${region}</span></p>
            <p><b>Sub Region: </b><span>${subregion || ''}</span></p>
            <p><b>Capital: </b><span>${capital || ''}</span></p>
            </div>
            <div class="right-content">
            <p><b>Top Level Domain: </b><span>${tld}</span></p>
            <p><b>currencies: </b><span>${currencyValue()}</span></p>
            <p><b>languages: </b><span>${languagesValue()}</span></p>
            </div>
            </div>
            <div class="border-country">
            <b>Border Countries: </b>
            </div>
            </div>`
        )
    }).join("")
    
    const borderCountry = document.querySelector('.border-country');
}