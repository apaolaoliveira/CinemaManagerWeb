import 'bootstrap';
import './main-screen.css';
import { movieService } from '../../services/movie.service';
import { MovieList } from '../../models/movie-list';
import { ListType } from '../../models/list-type';

export class mainScreen {
    private movieService: movieService;
    private movieList: HTMLDivElement;

    constructor() {
        this.movieService = new movieService();
        this.uploadLists();
    }

    uploadLists() {
        this.movieService.getListType(ListType.Trending)
            .then(movies => this.setMovieLists(movies, 'TrendingList'));

        this.movieService.getListType(ListType.Launches)
            .then(movies => this.setMovieLists(movies, 'LaunchesList'));

        this.movieService.getListType(ListType.Upcoming)
            .then(movies => this.setMovieLists(movies, 'UpcomingList'));
    }

    setMovieLists(movies: MovieList[], name: string) {
        this.movieList = document.getElementById(name) as HTMLDivElement;

        movies.forEach((movie) => {
            const column = document.createElement('div');
            column.className = 'col-6 col-md-4 col-lg-2 text-center ';

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

window.addEventListener('load', () => new mainScreen());