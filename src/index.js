import Notiflix from 'notiflix';
import PictureApiService from "./api.js";
import LoadMoreBtn from "./loadMore.js";

const refs = {
    form: document.getElementById('search-form'),
    input: document.querySelector("input[name='searchQuery']"),
    galleryContainer: document.querySelector(".gallery")
}
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});
const pictureApiService = new PictureApiService();
refs.form.addEventListener("submit", onSubmit)
loadMoreBtn.refs.button.addEventListener("click", onBtnClick)


async function onSubmit(event){
    event.preventDefault()
    clearPictureContainer()
    loadMoreBtn.hide()
    const form = event.currentTarget.elements
    pictureApiService.query = form.searchQuery.value.trim()
    pictureApiService.resetPage();
    if(pictureApiService.query === ""){
        clearPictureContainer ()
        return Notiflix.Notify.failure('You must enter something');
    }
    try{
        const getPicture = await pictureApiService.fetchPictures()
        if(getPicture.hits.length === 0 ){
            return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
        }else if(getPicture.hits.length >= getPicture.totalHits){
            renderMarkup(getPicture.hits)
            loadMoreBtn.hide()
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            return ''
        }else{
            renderMarkup(getPicture.hits)
            loadMoreBtn.show()
        }
        
    }catch(error){
        console.log(error)
    }
    
}

async function onBtnClick(){
    try{
        const morePicture = await pictureApiService.fetchPictures()
        renderMarkup(morePicture.hits)
        console.log(pictureApiService.page)
        if(morePicture.hits.length === 0){
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
            return;
        }else if(morePicture.hits && morePicture.totalHits < 40){
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
            return;
        }else if(morePicture.totalHits / 40 <= pictureApiService.page){
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
            return;
        }
    }catch (error){
        console.log(error)
    }
}

function clearPictureContainer (){
    refs.galleryContainer.innerHTML = ' ';
    
}


async function renderMarkup(hits){
    const markUp = await hits.map((hit)=>{
        return `
        <div class="photo-card">
        <a href ="${hit.webformatURL}">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy"  />
        </a>
        <div class="info">
            <p class="info-item">
            <b>Likes:</b>${hit.likes}
            </p>
            <p class="info-item">
            <b>Views:</b>${hit.views}
            </p>
            <p class="info-item">
            <b>Comments:</b>${hit.comments}
            </p>
            <p class="info-item">
            <b>Downloads:</b>${hit.downloads}
            </p>
        </div>
        </div>
        `
    })
    .join('')
    refs.galleryContainer.insertAdjacentHTML('beforeend', markUp)
}