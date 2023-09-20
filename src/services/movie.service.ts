import { API_KEY } from "../../secrets";
import { movieDetails } from "../models/details";
import { IFavoriteMovies } from "../models/favorites";
import { ListType } from "../models/list-type";
import { MovieList } from "../models/movie-list";
import { favoriteRepository } from "./favorite-repository";

export class movieService {
    private url: string;
    private options: RequestInit;
    private urlVideo: string = 'https://www.youtube.com/embed/';
    private favoritesRepository: favoriteRepository;
    private favorites: IFavoriteMovies;

    constructor(){
        this.favoritesRepository = new favoriteRepository();
        this.favorites = this.favoritesRepository.getFavorites();
        this.configOptions();
    }

    configOptions() {
        this.options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`
            }
        }
    }

    public async getListType(type: ListType){
        switch(type){
            case ListType.Favorites: 
                return await this.getMovieById(this.favorites.favoritesIds);

            case ListType.TopRated:
                this.url = 'https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1';
                break;

            case ListType.Trending:
                this.url = 'https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1';
                break;

            case ListType.Launches:
                this.url = 'https://api.themoviedb.org/3/movie/now_playing?language=pt-BR';
                break;

            case ListType.Upcoming:
                this.url = 'https://api.themoviedb.org/3/movie/upcoming?language=pt-BR';
                break;
        }

        const res = await fetch(this.url, this.options);
        const json = await this.verifyAnswer(res);
        return await this.mapMovieListPromise(json.results);
    }

    verifyAnswer(res: Response): any {
        if (res.ok)
            return res.json();

        throw new Error('Movie not found!');
    }

    mapMoviesList(obj: any): MovieList {
        return{
            id: obj.id,
            title: obj.title,
            overview: obj.overview,
            poster: obj.poster_path,
            banner: obj.backdrop_path
        }
    }

    public mapMoviesDetails(obj: any): movieDetails{
        return{
            id: obj.id,
            title: obj.title,
            poster: obj.poster_path,
            overview: obj.overview,
            votes: obj.vote_count,
            genres: obj.genres.map((genero: any) => genero.name),
            banner: obj.backdrop_path,
            trailer: this.urlVideo
        }
    }

    public mapMovieListPromise(obj: any[]): Promise<MovieList[]> {
        const movies = obj.map(m => this.mapMoviesList(m));

        return Promise.all(movies);
    }

    public async getUrlTrailer(id: string): Promise<string> {
        this.url = `https://api.themoviedb.org/3/movie/${id}/videos?language=pt-BR`;

        const res = await fetch(this.url, this.options);
        const obj = await this.verifyAnswer(res);
        return this.mapMovieTrailer(obj.results);
    }

    public mapMovieTrailer(obj: any[]): string {
        const trailerDub = obj.find(trailer => trailer.type === 'Trailer' && (trailer.name.includes('Dub') || trailer.name.includes('DUB')));
        const trailerLeg = obj.find(trailer => trailer.type === 'Trailer' && (trailer.name.includes('Leg') || trailer.name.includes('LEG')));
        const trailer = obj.find(trailer => trailer.type === 'Trailer');
        const teaser = obj.find(trailer => trailer.type === 'Teaser');
    
        const videoKey = trailerDub?.key || trailerLeg?.key || trailer?.key || teaser?.key;
    
        return videoKey ? `https://www.youtube.com/embed/${videoKey}` : '';
    }

    public async getMovieById(ids: number[]): Promise<MovieList[]> {
        ids.shift();

        let objs: any[] = [];

        for (const id of ids) {
            this.url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;
    
            const res = await fetch(this.url, this.options);
            const obj = await this.verifyAnswer(res);
            objs.push(obj);
        }

        let movies = objs.map(obj => this.mapMoviesList(obj));

        return Promise.all(movies);
    }

    public async getMovieDetailsById(id: string): Promise<movieDetails> {
        this.url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;

        const resposta = await fetch(this.url, this.options);
        const obj = await this.verifyAnswer(resposta);
        return this.mapMoviesDetails(obj);
    }
}