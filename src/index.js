import './sass/main.scss';
import Notiflix from "notiflix";
// Дополнительный импорт стилей
import 'notiflix/dist/notiflix-3.2.2.min.css';

const ref = {
    inputForm:document.querySelector(".search-form"),
    inputField: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    URL: "https://pixabay.com/api/",
    key: "25089539-92235f01f3468a6ac8c56a646",
}

ref.inputForm.addEventListener('submit', onSubmit);

function onSubmit(evt) {
    evt.preventDefault();
    const searchName = evt.currentTarget.elements.searchQuery.value.trim();
    if (!searchName) {
        Notiflix.Notify.info("Нечего искать");
        return;
    }
    fetchPics(searchName)
        .then(data => render(data));    
}

function fetchPics(searchName) {
    return fetch(`${ref.URL}?key=${ref.key}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(resp => resp.json())
}

function render({ hits }) {
    if (!hits.length) {  // Если картинок нет
        Notiflix.Notify.info("Нет таких картинок")
        return;
    }
    const markup = hits.map(hit => {
        return `<li><image src=${hit.webformatURL}/></li>`
    }).join("");
    ref.gallery.innerHTML = markup;
}