// Action Types
export const TOGGLE_EVENT_SELECTION = 'TOGGLE_EVENT_SELECTION';

// Action Creators
export const toggleEventSelection = (eventId) => ({
  type: TOGGLE_EVENT_SELECTION,
  payload: eventId,
});
