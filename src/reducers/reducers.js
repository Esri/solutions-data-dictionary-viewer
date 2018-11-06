let defaultState = {
  filterWords: [],
  detailData: null
};

const reducers = (state = defaultState, action) => {
  switch(action.type) {
    case 'FILTER':
      return {
        ...state,
        filterWords: [action.payload]
      }
    case 'DETAILS':
      return {
        ...state,
        detailData: [action.payload]
      }
    default:
      return state;
  }
}

export default reducers;