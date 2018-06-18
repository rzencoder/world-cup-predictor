import { combineReducers } from 'redux';
import { items, knockouts, itemsHasErrored, itemsIsLoading } from './items';

export default combineReducers({
    items,
    knockouts,
    itemsHasErrored,
    itemsIsLoading,
});