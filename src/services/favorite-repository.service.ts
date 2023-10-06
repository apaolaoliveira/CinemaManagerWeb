import { IFavoriteMovies } from "../models/favorites";

export class favoriteRepository {
    public getFavorites(): IFavoriteMovies {
        const favoriteJson = localStorage.getItem('favorites');

        if(favoriteJson){
            return JSON.parse(favoriteJson);
        } else {
            return {
                favoritesIds: [],
            };
        }
    }

    public setFavorites(favorites: IFavoriteMovies) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}