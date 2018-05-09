import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import visits from './visits'
import parkList from './parkList'
import location from './location'
import pets from './pets'
import friends from './friends'
import events from './events'

const reducer = combineReducers({user, visits, parkList, pets, location, friends, events})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './visits'
export * from './parkList'
export * from './location'
export * from './pets'
export * from './friends'
export * from './events'
