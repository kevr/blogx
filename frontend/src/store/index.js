import { createStore } from 'redux';
import { sessionReducer } from './session';

export const store = createStore(sessionReducer);
