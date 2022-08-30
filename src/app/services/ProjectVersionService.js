import { 
    createDoc,
    editDoc,
    onGetDocs,
    removeDoc,
    getDocsByField,   
    getDocById,
    getDocByTwoFields
} from '../firebase/api'

const collectionName = "project_versions";

export const createProjectVersion = (newProjectVersion) => createDoc(collectionName, newProjectVersion);

export const updateProjectVersion = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const onGetProjectVersions = (callback) => onGetDocs(collectionName, callback);

export const deleteProjectVersion = (id) => removeDoc(collectionName, id);

export const getProjectVersion = (id) => getDocById(collectionName, id);

export const getProjectVersions = (projectId) => getDocsByField(collectionName, "project_id", projectId, "==");

export const getProjectByStatus = (projectId, status) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "status", status, "==");
