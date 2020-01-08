import {GET_BRANCHES,GET_INSTITUDES} from '../actions/sidebarAction';


const initialState = {
		branches: [],
	
}

export default function app(state = initialState, action) {
	

	switch (action.type) {
		case GET_BRANCHES:
			return {
				...state,
				branches: action.payload
				
			}
		
		default:
			return state
	}
}