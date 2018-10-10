import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { filterAction } from './actions/actions';

export const mapStateToProps = (state) => {
  return {
    filterWords: state.filterWords
  }
}

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ filterAction }, dispatch);
}

