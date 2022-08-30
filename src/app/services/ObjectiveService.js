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

const collectionName = "objectives";

export const createObjective = (newObjective) => createDoc(collectionName, newObjective);

export const updateObjective = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const deleteObjective = (id) => removeDoc(collectionName, id);

export const onGetObjective = (callback) => onGetDocs(collectionName, callback);

export const getGeneralObjective = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "is_general", true, "==");

export const getSpecificObjective = (projectId, order) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "is_general", false, "==", "order", order, "==");

export const getCurrentGeneralObjective = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "is_general", true, "==", "project_version_id", "", "==");

export const getCurrentSpecificObjective = (projectId, order) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "is_general", false, "==", "order", order, "==", "project_version_id", "", "==");

export const getCurrentObjectives = (projectId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", "", "==");

export const getVersionObjectives = (projectId, projectVersionId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", projectVersionId, "==");
