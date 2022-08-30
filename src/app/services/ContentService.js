import { 
    createDoc,
    editDoc,
    onGetDocs,
    getDocByTwoFields,
    getDocByThreeFields,
    getDocsByTwoFields
} from '../firebase/api'

const collectionName = "contents";

export const createContent = (newContent) => createDoc(collectionName, newContent);

export const updateContent = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const onGetContent = (callback) => onGetDocs(collectionName, callback);

export const getContent = (projectId, category) => getDocByTwoFields(collectionName, "project_id", projectId, "==", "category", category, "==");

export const getCurrentContent = (projectId, category) => getDocByThreeFields(collectionName, "project_id", projectId, "==", "category", category, "==", "project_version_id", "", "==");

export const getVersionContents = (projectId, projectVersionId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", projectVersionId, "==");

export const getCurrentContents = (projectId) => getDocsByTwoFields(collectionName, "project_id", projectId, "==", "project_version_id", "", "==");