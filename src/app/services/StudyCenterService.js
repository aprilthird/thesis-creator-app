import { 
    onGetDocs,
    getDocList,
    getDocById,    
} from '../firebase/api'

const collectionName = "study_centers";

export const onGetStudyCenters = (callback) => onGetDocs(collectionName, callback);

export const getStudyCenters = () => getDocList(collectionName);

export const getStudyCenter = (id) => getDocById(collectionName, id);