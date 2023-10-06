import 'bootstrap';
import './favorites-screen.css';
import { favoriteRepository } from '../../services/favorite-repository.service';
import { IFavoriteMovies } from '../../models/favorites';
import { movieService } from '../../services/movie.service';
import { ListType } from '../../models/list-type';
import { MovieList } from '../../models/movie-list';

export class favoritesScreen {
    private movieService: movieService;
    private movieList: HTMLDivElement;
    private favoritesRepository: favoriteRepository;
    private favorites: IFavoriteMovies;

    constructor() {
        this.movieService = new movieService();
        this.favoritesRepository = new favoriteRepository();
        this.favorites = this.favoritesRepository.getFavorites();
        this.uploadLists();
    }

    uploadLists() {
        this.movieService.getListType(ListType.Favorites)
            .then(movies => this.setMovieLists(movies, 'FavoritesList'));
    }

    setMovieLists(movies: MovieList[], name: string) {
        this.movieList = document.getElementById(name) as HTMLDivElement;

        movies.forEach((movie) => {
            const column = document.createElement('div');
            column.className = 'col-6 col-md-4 col-lg-2 text-center';

            const card = document.createElement('div');
            card.className = 'movie-card';

            const link = document.createElement('a');
            link.className = "fs-5 text-warning text-decoration-none";
            link.href = `details.html?id=${movie.id}`;

            const img = document.createElement("img");
            img.src = `https://image.tmdb.org/t/p/original${movie.poster}`;
            img.className = "img-fluid rounded-4 my-3";
            img.alt = `Filme ${movie.title}`;

            const cardBody = document.createElement('div');
            cardBody.className = "card-body";

            const title = document.createElement('h5');
            title.className = "card-title";
            title.textContent = movie.title;
            title.style.opacity = '0';

            card.addEventListener('mouseenter', () => {
                title.style.opacity = '1';
                img.style.transform = 'scale(1.1)'; 
            });
    
            card.addEventListener('mouseleave', () => {
                title.style.opacity = '0';
                img.style.transform = 'scale(1)';
            });

            link.appendChild(img);
            link.appendChild(cardBody);
            cardBody.appendChild(title);
            card.appendChild(link);
            column.appendChild(card);
            this.movieList.appendChild(column);
        });
    }
}

window.addEventListener('load', () => new favoritesScreen());