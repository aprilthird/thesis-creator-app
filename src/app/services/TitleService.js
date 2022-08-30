import { 
    createDoc,
    editDoc,
    onGetDocs,
    getDocByField,
    removeDoc,
    getDocByTwoFields
} from '../firebase/api'

const collectionName = "titles";

export const createTitle = (newTitle) => createDoc(collectionName, newTitle);

export const updateTitle = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const deleteTitle = (id) => removeDoc(collectionName, id);

export const onGetTitle = (callback) => onGetDocs(collectionName, callback);

export const getTitle = (projectId) => getDocByField(collectionName, "project_id", projectId, "==");

export const getVersionTitle = (projectId, projectVersionId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", projectVersionId, "==")

export const getCurrentTitle = (projectId) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", "", "==");
