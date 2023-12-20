const container = document.querySelector('.main');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
let Birth_Year = document.querySelector('#Birth_Year');
let Gender = document.querySelector('#Gender');
let Species = document.querySelector('#Species');
let Homeworld = document.querySelector('#Homeworld');
let Films = document.querySelector('#Films');
let Tital = document.querySelector('#exampleModalLabel');
let prevbtn = document.querySelector('#page1');
let spinner = document.querySelector("#spinner");

let CurrentPage;
let imageDataArr = [];
let CurrentPageNo;
const init = () => {
    loadData('https://swapi.dev/api/people/?page=1');
}

const loadData = async (url) => {
    spinner.hidden = false;
    CurrentPageNo = url.slice(35)
    const res = await fetch(url);
    const data = await res.json();
    CurrentPage = data;
    spinner.hidden = true;
    addCard(data.results)
    // console.log(CurrentPage);
}

const addCard = (res) => {
    imageDataArr = [];
    res.forEach(async (element, index) => {

        const imgsrc = `https://starwars-visualguide.com/assets/img/characters/${element.url.split('/')[5]}.jpg`;

        let html = `<div id="char${element.url.split('/')[5]}" class="card mb-5 mx-2" style="width: 15rem;" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <img src="${imgsrc}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${element.name}</h5>
        </div>
    </div> `;
    container.insertAdjacentHTML("beforeend", html);
    });

    if (!CurrentPage.previous) {
        prev.closest('.page-item').classList.add('disabled');
    }
    if (!CurrentPage.next) {
        next.closest('.page-item').classList.add('disabled');
    }
}

next.addEventListener('click', () => {
    // console.log('pagination',CurrentPage.next);
    next.closest('.page-item').classList.remove('disabled');
    prev.closest('.page-item').classList.remove('disabled');
    loadData(CurrentPage.next);
    container.innerHTML = '';

})
prev.addEventListener('click', () => {
    // console.log('pagination',CurrentPage.previous);
    prev.closest('.page-item').classList.remove('disabled');
    next.closest('.page-item').classList.remove('disabled');
    loadData(CurrentPage.previous);
    container.innerHTML = '';

})


const modelData = (sp) => {

    let loadingAnimation = '<img class="textLoading" src="loading.gif" alt="">';
    // console.log(sp);
    Species.innerHTML = loadingAnimation;
    Homeworld.innerHTML = loadingAnimation;
    Films.innerHTML = loadingAnimation;
    Promise.all(sp.map(ins => Promise.all(ins.map(i => getJSON(i))))).
        then(res => {
            let [[species], [homeworld], films] = res;
            Species.innerText = species ? species.name : 'Unknown';
            Homeworld.innerText = homeworld ? homeworld.name : 'Unknown';
            Films.innerText = films ? films.map(f => f.title).join(', ') : 'Unknown';

            document.querySelector('.btn-close').addEventListener('click', function () {
                Birth_Year.innerText = '';
                Gender.innerText = '';
                Species.innerText = '';
                Homeworld.innerText = '';
                Films.innerText = '';
            })
        })
}

const openmodel = (e) => {

    if (!e.target.closest('.card')) return;

    let char = e.target.closest('.card').id.slice(4);
    const imgsrc = `https://starwars-visualguide.com/assets/img/characters/${char}.jpg`;
    if (char >= 18) {
        char--
    }
    console.log('char id : ', char);
    console.log(imgsrc);

    console.log('currentPgae', (char - ((CurrentPageNo - 1) * 10) - 1));
    let charData = CurrentPage.results[char - ((CurrentPageNo - 1) * 10) - 1];
    console.log(char);

    Tital.innerText = charData.name;
    Birth_Year.innerText = charData.birth_year;
    Gender.innerText = charData.gender;
    charImg.src = imgsrc;
    modelData([charData.species, [charData.homeworld], charData.films]);
}


init();
container.addEventListener('click', openmodel.bind(this));



const getJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    } catch (error) {
        throw new Error(`Fetch failed: ${error.message}`);
    }
};
