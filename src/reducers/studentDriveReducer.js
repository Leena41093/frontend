import { GET_STUDENTDRIVECLASS, GET_STUDENTDRIVESUBJECT, GET_STUDENTDRIVEFOLDER, GET_STUDENTDRIVEFILE ,RENAME_DRIVEFILENAME,DELETE_DRIVEFILE} from '../actions/studentDriveAction';

const initialState = {
    driveClasses: null,
    driveSubjects: null,
    driveFolder: null,
    renameFile:null,
    deleteFile:null,
}

export default function professor(state = initialState, action) {
    
    switch (action.type) {
        case GET_STUDENTDRIVECLASS:
            return {
                ...state,
                driveClasses: action.payload,
            }
        case GET_STUDENTDRIVESUBJECT:
            return {
                ...state,
                driveSubjects: action.payload,
            }
        case GET_STUDENTDRIVEFOLDER:
            return {
                ...state,
                driveFolder: action.payload,
            }
        case GET_STUDENTDRIVEFILE:
            return {
                ...state,
                driveFiles: action.payload,
            }
        case RENAME_DRIVEFILENAME:
        return{
            ...state,
            renameFile:action.payload,
        }  
        case DELETE_DRIVEFILE:
        return {
            ...state,
            deleteFile:action.payload
        }  
        default:
            return state

    }
}