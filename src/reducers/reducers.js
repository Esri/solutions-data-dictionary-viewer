let defaultState = {
  filterWords: [],
  detailData: null,
  metaData: null,
  nodes: null,
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
    case 'METADATA':
      return {
        ...state,
        metaData: [action.payload]
      }
    case 'NODES':
      return {
        ...state,
        nodes: [action.payload]
      }
    default:
      return state;
  }
}

export default reducers;