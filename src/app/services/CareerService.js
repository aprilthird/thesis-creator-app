import { 
    onGetDocs,
    getDocList,
    getDocById,    
} from '../firebase/api'

const collectionName = "careers";

export const onGetCareers = (callback) => onGetDocs(collectionName, callback);

export const getCareers = () => getDocList(collectionName);

export const getCareer = (id) => getDocById(collectionName, id);