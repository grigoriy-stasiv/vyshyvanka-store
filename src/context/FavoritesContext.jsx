import { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const savedFavorites = localStorage.getItem('vyshyvanka-favorites');

    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('vyshyvanka-favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = productId => {
    setFavoriteIds(currentIds =>
      currentIds.includes(productId)
        ? currentIds.filter(id => id !== productId)
        : [...currentIds, productId],
    );
  };

  const isFavorite = productId => favoriteIds.includes(productId);

  const removeFavorite = productId => {
    setFavoriteIds(currentIds => currentIds.filter(id => id !== productId));
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoritesCount: favoriteIds.length,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};
