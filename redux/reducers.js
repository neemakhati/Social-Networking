import { TOGGLE_EVENT_SELECTION } from './actions';

const initialState = {
  selectedEvents: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_EVENT_SELECTION:
      const { selectedEvents } = state;
      const eventId = action.payload;
      const isSelected = selectedEvents.includes(eventId);
      if (isSelected) {
        return {
          ...state,
          selectedEvents: selectedEvents.filter((id) => id !== eventId),
        };
      } else {
        return {
          ...state,
          selectedEvents: [...selectedEvents, eventId],
        };
      }
    default:
      return state;
  }
};

export default reducer;
