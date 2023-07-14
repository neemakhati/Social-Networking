// redux/favoriteWorkshopsReducer.js
const initialState = [];

const favoriteWorkshopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_FAVORITE_WORKSHOP':
      return [...state, action.payload];
    case 'REMOVE_FAVORITE_WORKSHOP':
      return state.filter(workshop => workshop.id !== action.payload.id);
    default:
      return state;
  }
};

export default favoriteWorkshopsReducer;
