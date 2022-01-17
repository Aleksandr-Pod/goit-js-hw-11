import './sass/main.scss';
import Notiflix from "notiflix";
// Дополнительный импорт стилей
import 'notiflix/dist/notiflix-3.2.2.min.css';

const ref = {
    inputForm: document.querySelector(".search-form"),
    inputField: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    loadMore: document.querySelector(".load-more"),
    URL: "https://pixabay.com/api/",
    key: "25089539-92235f01f3468a6ac8c56a646",
}
ref.loadMore.hidden = true;
ref.inputForm.addEventListener('submit', onSubmit);
ref.loadMore.addEventListener('click', onLoadMore)

function onSubmit(evt) {
    evt.preventDefault();
    const searchName = evt.currentTarget.elements.searchQuery.value.trim();
    if (!searchName) {
        Notiflix.Notify.info("Nothing to search");
        return;
    }
    fetchPics(searchName)
        .then(data => {
            render(data);
            ref.loadMore.hidden = false;
        })
        .catch(error => {
            Nitiflix.Notify.info("server query error")
        });    
}

function fetchPics(searchName) {
    return fetch(`${ref.URL}?key=${ref.key}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(resp => resp.json())
}

function render({ hits }) {
    if (!hits.length) {  // Если картинок нет
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
        return;
    }
    const markup = hits.map(hit => {
        return `<li><img src=${hit.webformatURL} width="320" alt=${hit.tags} loading="lazy"/>
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
        </div></li>`
    }).join("");
    ref.gallery.innerHTML = markup;
}
function onLoadMore() {

}