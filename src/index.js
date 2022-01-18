import './sass/main.scss';

import Notiflix from "notiflix";
// Дополнительный импорт стилей
import 'notiflix/dist/notiflix-3.2.2.min.css';

import axios from "axios";

import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';


const ref = {
    inputForm: document.querySelector(".search-form"),
    inputField: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    loadMore: document.querySelector(".load-more"),
    pageField: document.querySelector(".page-field"),
}

const URL = "https://pixabay.com/api/";
const key = "25089539-92235f01f3468a6ac8c56a646";
ref.loadMore.hidden = true;
ref.pageField.hidden = true;
let page = 1;
const perPage = 30;
let searchName = "";

ref.inputForm.addEventListener('submit', onSubmit);
ref.loadMore.addEventListener('click', onLoadMore);

function onSubmit(evt) {
    evt.preventDefault();
    searchName = evt.currentTarget.elements.searchQuery.value.trim();
    if (!searchName) {
        Notiflix.Notify.info("Nothing to search");
        return;
    }
    page = 1;
    fetchPics(searchName)
        .then(data => render(data))
        .catch(error => {
            Notiflix.Notify.info("server query error")
        });
}

async function fetchPics(searchName) {
    ref.loadMore.hidden = true;
    ref.pageField.hidden = true;
    const resp = await axios.get(`${URL}?key=${key}&q=${searchName}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
    return resp.data;
}

function render({ total, hits }) {
    if (!hits.length) {  // Если картинок нет
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
        return;
    }
    ref.pageField.hidden = false;
    ref.pageField.textContent = `Page:${page}`
    ref.loadMore.hidden = false;
    if ( page === 1 ) {Notiflix.Notify.info(`Hooray! We found ${total} images.`)}
    markup(hits);
    const simplelightbox = new SimpleLightbox(".photo-card"); // photo-card - класс на ссылке
    simplelightbox.on("show.simplelightbox");
}
function markup (hits) {
    const markup = hits.map(hit => {
        return `<a href=${hit.largeImageURL} class="photo-card"><img src=${hit.webformatURL} alt=${hit.tags} loading="lazy"/>
        <div class="info">
            <p class="info-item">
            <b>Likes: </b>${hit.likes}
            </p>
            <p class="info-item">
            <b>Views: </b>${hit.views}
            </p>
            <p class="info-item">
            <b>Comments: </b> ${hit.comments}
            </p>
            <p class="info-item">
            <b>Downloads: </b> ${hit.downloads}
            </p>
        </div></a>`
    }).join("");
    ref.gallery.innerHTML = markup;
}

function onLoadMore() {
    page += 1;
    fetchPics(searchName)
    .then(data => render(data))
        .catch(error => {
            Notiflix.Notify.info("server query error")
        });
}
