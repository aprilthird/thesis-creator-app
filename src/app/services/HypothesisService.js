import { 
    createDoc,
    editDoc,
    onGetDocs,
    getDocByTwoFields,
    getDocByThreeFields,
    getDocsByField,
    removeDoc,
    getDocsByTwoFields
} from '../firebase/api'

const collectionName = "hypothesis";

export const createHypothesis = (newHypothesis) => createDoc(collectionName, newHypothesis);

export const updateHypothesis = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const deleteHypothesis = (id) => removeDoc(collectionName, id);

export const onGetHypothesis = (callback) => onGetDocs(collectionName, callback);

export const getGeneralHypothesis = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "is_general", true, "==");

export const getSpecificHypothesis = (projectId, order) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "is_general", false, "==", "order", order, "==");

export const getCurrentGeneralHypothesis = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "is_general", true, "==", "project_version_id", "", "==");

export const getCurrentSpecificHypothesis = (projectId, order) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "is_general", false, "==", "order", order, "==", "project_version_id", "", "==");

export const getCurrentHypothesis = (projectId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", "", "==");

export const getVersionHypothesis = (projectId, projectVersionId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", projectVersionId, "==");
