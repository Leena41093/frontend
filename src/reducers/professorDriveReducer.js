import { GET_PROFESSORDRIVECLASS, GET_PROFESSORDRIVESUBJECT, GET_PROFESSORDRIVEFOLDER, GET_PROFESSORDRIVEFILES,
  RENAME_PROFESSORDRIVEFILES,DELETE_PROFESSORFILE,PROFESSOR_FOLDERQUIZLIST ,
  CREATE_PROFESSORDRIVENEWFOLDER,GET_PROFESSORDRIVEFILESOFFOLDERS,CREATE_PERSONALDRIVEFILE,
  GET_PROFESSORDRIVEFOLDERANDFILES,DOWNLOAD_PERSONALDRIVEFILE,QUIZLISTFORDRIVE} from '../actions/professorDriveAction';

const initialState = {
  driveClasses: null,
  driveSubject: null,
  driveFolder: null,
  driveFile: null,
  fileRename: null,
  deleteFile:null,
  DriveQuizList:null,
  professorDriveNewFolder:null,
  getProfessorDriveFilesOfFolders:null,
  addPersonalFile:null,
  getProfDriveFolderAndFiles:null,
  personalDriveFileDownload:null,
  quizlistfordrivedata:null
}

export default function professor(state = initialState, action) {
 

  switch (action.type) {
    case GET_PROFESSORDRIVECLASS:
      return {
        ...state,
        driveClasses: action.payload,
      }
    case GET_PROFESSORDRIVESUBJECT:
      return {
        ...state,
        driveSubject: action.payload,
      }
    case GET_PROFESSORDRIVEFOLDER:
      return {
        ...state,
        driveFolder: action.payload,
      }
    case GET_PROFESSORDRIVEFILES:
      return {
        ...state,
        driveFile: action.payload
      }
    case RENAME_PROFESSORDRIVEFILES:
    return {
      ...state,
      fileRename:action.payload
    }  
    case DELETE_PROFESSORFILE:
    return {
      ...state,
      deleteFile:action.payload
    }
    case  PROFESSOR_FOLDERQUIZLIST:
		return{
			...state,
			DriveQuizList: action.payload,
    }	
    case CREATE_PROFESSORDRIVENEWFOLDER:
    return{
      ...state,
      professorDriveNewFolder:action.payload,
    }
    case GET_PROFESSORDRIVEFILESOFFOLDERS:
    return{
      ...state,
      getProfessorDriveFilesOfFolders:action.payload
    }
    case CREATE_PERSONALDRIVEFILE:
    return{
      ...state,
      addPersonalFile:action.payload
    }
    case GET_PROFESSORDRIVEFOLDERANDFILES:
    return{
      ...state,
      getProfDriveFolderAndFiles:action.payload
    } 
    case DOWNLOAD_PERSONALDRIVEFILE:
    return{
      ...state,
       personalDriveFileDownload:action.payload
    }
    case QUIZLISTFORDRIVE:
      return{
        ...state,
        quizlistfordrivedata:action.payload
      }
    default:
      return state

  }
}