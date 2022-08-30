import { 
    createDoc,
    editDoc,
    onGetDocs,
    getDocList,
    removeDoc,
    getDocById,    
    getDocsByField
} from '../firebase/api'

const collectionName = "projects";

export const createProject = (newProject) => createDoc(collectionName, newProject);

export const updateProject = (id, updatedFields) => editDoc(collectionName, id, updatedFields);

export const onGetProjects = (callback) => onGetDocs(collectionName, callback);

export const getProjects = () => getDocList(collectionName);

export const getProjectsByUserId = (userId) => getDocsByField(collectionName, "user_id", userId, "==");

export const deleteProject = (id) => removeDoc(collectionName, id);

export const getProject = (id) => getDocById(collectionName, id);