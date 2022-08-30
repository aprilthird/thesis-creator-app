import { 
    onGetDocs,
    getDocList,
    getDocById,    
    getDocsByField,
} from '../firebase/api'

const collectionName = "verbs";

export const onGetVerbs = (callback) => onGetDocs(collectionName, callback);

export const getVerbs = () => getDocList(collectionName);

export const getVerb = (id) => getDocById(collectionName, id);