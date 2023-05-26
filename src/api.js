import axios from "axios";
export default class PictureApiService {
    constructor(){
        this.searchQuery = '';
        this.page = 1;

    }
    async fetchPictures(){
        try{
            const URL = 'https://pixabay.com/api/';
            const key = '18818490-d3572911d029790c33b9a509f';
            const encodeQuery = encodeURIComponent(this.searchQuery);
            const response = await axios.get(`${URL}?key=${key}&q=${encodeQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`)
            this.pageIncreament()
            return response.data

        }catch(error){
            console.log(error)
        }
    }
    pageIncreament(){
        this.page +=1
    }
    resetPage(){
        this.page = 1;
    }
    get query(){
        return this.searchQuery
    }
    set query(newQuery){
        this.searchQuery = newQuery;
    }
}



















