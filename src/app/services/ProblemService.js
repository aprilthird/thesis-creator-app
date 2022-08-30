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

const collectionName = "problems";

export const createProblem = (newProblem) => createDoc(collectionName, newProblem);

export const updateProblem = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const deleteProblem = (id) => removeDoc(collectionName, id);

export const onGetProblem = (callback) => onGetDocs(collectionName, callback);

export const getGeneralProblem = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "is_general", true, "==");

export const getSpecificProblem = (projectId, order) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "is_general", false, "==", "order", order, "==");

export const getCurrentGeneralProblem = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "is_general", true, "==", "project_version_id", "", "==");

export const getCurrentSpecificProblem = (projectId, order) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "is_general", false, "==", "order", order, "==", "project_version_id", "", "==");

export const getCurrentProblems = (projectId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", "", "==");

export const getVersionProblems = (projectId, projectVersionId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", projectVersionId, "==");
