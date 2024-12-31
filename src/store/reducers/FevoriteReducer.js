import {
  ADD_TO_FEVORITE,
  REMOVE_FROM_FEVORITE,
  SET_FEVORITE_ITEM
} from '../actions/type';

const initialState = {
  favoriteProducts: [], // Initialize as an empty array to avoid undefined
};

const FavoriteReducer = (state = initialState, action) => {
  console.log('Action received::::::::::::: ', action);
  console.log('Current state::::::::::::: ', state);

  switch (action.type) {
    
    case ADD_TO_FEVORITE:
      console.log(111111111);
      
      // Ensure favoriteProducts is always an array and handle the logic
      if (!initialState?.favoriteProducts?.includes(action.payload)) {
        console.log('111111:::::::::::::',initialState.favoriteProducts);
        
        console.log('Adding to favorites', action.payload);
        
        return {
          ...state,
          favoriteProducts: [...initialState.favoriteProducts, action.payload],
        };
      }
      return state; // No change if the product is already in favorites.

    case REMOVE_FROM_FEVORITE:
      console.log(2222222222);
      
      // Make sure favoriteProducts is always an array and handle removal logic
      return {
        ...state,
        favoriteProducts: initialState.favoriteProducts.filter(
          (productId) => productId !== action.payload // Remove the product ID
        ),
      };

    case SET_FEVORITE_ITEM:
      console.log(33333333333);
      
      // Ensure products are properly set and default to empty array if needed
      return {
        ...state,
        favoriteProducts: action.products || [], // Default to empty array if no products are passed
      };

    default:
      return state;
  }
};

export default FavoriteReducer;
