import { 
    onGetDocs,
    getDocList,
    getDocById,    
    getDocsByField,
} from '../firebase/api'

const collectionName = "variables";

export const onGetVariables = (callback) => onGetDocs(collectionName, callback);

export const getVariables = () => getDocList(collectionName);

export const getVariablesByCareerId = (careerId) => getDocsByField(collectionName, "career_id", careerId, "==");

export const getVariable = (id) => getDocById(collectionName, id);