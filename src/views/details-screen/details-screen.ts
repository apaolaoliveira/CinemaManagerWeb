import 'bootstrap';
import './details-screen.css';
import { IFavoriteMovies } from '../../models/favorites';
import { favoriteRepository } from '../../services/favorite-repository.service';
import { movieService } from '../../services/movie.service';
import { movieDetails } from '../../models/details';

export class detailsScreen {
    private favorites: IFavoriteMovies;
    private favoritesRepository: favoriteRepository;
    private movieId: number;
    private movieService: movieService;
    private movieDetails: HTMLDivElement;

    constructor(){
        this.movieService = new movieService();
        this.favoritesRepository = new favoriteRepository();
        this.favorites = this.favoritesRepository.getFavorites();
        this.uploadMovie();
    }

    private movieSearch(id: string): Promise<void> {
        return this.movieService.getMovieDetailsById(id)
            .then(movie => this.DisplayMovieDetails(movie))
            .catch(err => console.log(err));
    }

    private uploadMovie() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        this.movieId = parseInt(id as string);
        this.movieSearch(id as string)
            .then(() => {
                this.movieService.getUrlTrailer(id as string)
                    .then(obj => {
                        const video = document.getElementById('video') as HTMLIFrameElement
                        video.src = obj;
                    });
            })
    }

    DisplayMovieDetails(movie: movieDetails): any {
        this.movieDetails =  document.getElementById("movieDetails") as HTMLDivElement;
    
        const divHeader = document.createElement("div");
        
        const header = document.createElement("div");
        header.className = "d-flex  align-items-center";
    
        const title = document.createElement("h1");
        title.textContent = movie.title;
    
        const btnFavorite = document.createElement("button");
        btnFavorite.className = "btn btn-danger text-dark ms-auto ml-5";
        if (this.favorites.favoritesIds.includes(this.movieId))
            btnFavorite.innerHTML = '<i class="bi bi-heart-fill"></i>';
        else
            btnFavorite.innerHTML = '<i class="bi bi-heart"></i>';
        btnFavorite.addEventListener('click', () => this.updateFavorites(btnFavorite));
    
        const votos = document.createElement("p");
        votos.className = "lead text-danger";
        votos.textContent = `${movie.votes} votos`;

        const divMedia = document.createElement("div");
        divMedia.className = "d-flex align-items-center gap-3";
    
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/original${movie.poster}`;
        img.className = "col-3 rounded-4 h-100";

        const trailer = document.createElement("iframe");
        trailer.className = "col-9 rounded-4 h-100";
        trailer.id = "video";
        trailer.src = movie.trailer;
        trailer.allowFullscreen = true;

        const divDescription = document.createElement("div");
        divDescription.className = "col-12";

        const movieGenres = document.createElement("p");
        movie.genres.forEach((genres) => {
            const badge = document.createElement("span");
            badge.className = "badge bg-danger rounded-pill text-black mx-1 fs-5 my-4";
            badge.textContent = genres;
            movieGenres.appendChild(badge);
        });

        const description = document.createElement("p");
        description.className = "fs-4"
        description.innerHTML = `${movie.overview}`;

        header.appendChild(title);
        header.appendChild(btnFavorite);
        divHeader.appendChild(header);
        divHeader.appendChild(votos);

        divMedia.appendChild(img);
        divMedia.appendChild(trailer);

        divDescription.appendChild(movieGenres);
        divDescription.appendChild(description);
    
        this.movieDetails.innerHTML = "";
        this.movieDetails.appendChild(divHeader);
        this.movieDetails.appendChild(divMedia);
        this.movieDetails.appendChild(divDescription);
    }

    private updateFavorites(btn: HTMLButtonElement) {
        if(btn.innerHTML.includes('bi-heart-fill')) {
            let index = this.favorites.favoritesIds.indexOf(this.movieId);
            this.favorites.favoritesIds.splice(index);
            btn.innerHTML = '<i class="bi bi-heart"></i>';
        }
        else {
            this.favorites.favoritesIds.push(this.movieId);
            btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        }

        this.favoritesRepository.setFavorites(this.favorites);
    }    
}

window.addEventListener('load', () => new detailsScreen());