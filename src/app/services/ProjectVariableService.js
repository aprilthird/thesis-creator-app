import { 
    createDoc,
    editDoc,
    onGetDocs,
    removeDoc,
    getDocById,
    getDocsByField,
    getDocsByTwoFields
} from '../firebase/api'

const collectionName = "project_variables";

export const createProjectVariable = (newProjectVariable) => createDoc(collectionName, newProjectVariable);

export const updateProjectVariable = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const onGetProjectVariables = (callback) => onGetDocs(collectionName, callback);

export const deleteProjectVariable = (id) => removeDoc(collectionName, id);

export const getProjectVariable = (id) => getDocById(collectionName, id);

export const getProjectVariables = (projectId) => getDocsByField(collectionName, "project_id", projectId, "==");

export const getVersionProjectVariables = (projectId, projectVersionId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", projectVersionId, "==");

export const getCurrentProjectVariables = (projectId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", "", "==");
