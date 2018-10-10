let defaultState = {
  filterWords: []
};

const reducers = (state = defaultState, action) => {
  switch(action.type) {
    case 'FILTER':
      return {
        ...state,
        filterWords: [action.payload]
      }
    default:
      return state;
  }
}

export default reducers;