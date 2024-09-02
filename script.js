let allCountries;
fetch('https://restcountries.com/v3.1/all').then(res => res.json())
    .then((allData) => {
        const NewData = [...allData.map((data)=>{
            return data
        })]
        fetchData(NewData);
        allCountries = NewData;
    })
    .catch(err => console.log(err));


const countriesContainer = document.querySelector('.countries-container');
const filterByRegion = document.querySelector('.filter-by-region');
const searchInput = document.querySelector('#search');
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

searchInput.addEventListener('input',(e)=>{
    const countryValue = allCountries.filter((countries)=>{
       return countries.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    })
    fetchData(countryValue);
})

function fetchData(data) {
    filterByRegion.addEventListener('change',(e)=>{
        fetch(`https://restcountries.com/v3.1/region/${e.target.value}`)
            .then(res => res.json())
            .then(fetchData)
    })
    countriesContainer.innerHTML = data.map((data)=>{
        let {name,population,region,flags,capital} = data;
        return (
            ` <a href="./country.html?name=${name.common}" class="country-card">
                <img src=${flags.svg} alt="">
                <div class="card-container">
                    <h3>${name.common}</h3>
                    <p class="country-about"><b>population</b><span>:
                     ${population.toLocaleString('en-IN')}</span></p>
                    <p class="country-about"><b>region</b><span>: ${region}</span></p>
                    <p class="country-about"><b>capital</b><span>: ${capital || 'country does not have capital'}</span></p>
                </div>
                 </a>`
        )
    }).join("")
}