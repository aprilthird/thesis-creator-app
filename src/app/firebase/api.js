import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit
} from "@firebase/firestore";
import { db } from "./config";

export const createDoc = (collectionName, newObject) =>
  addDoc(collection(db, collectionName), newObject);

export const editDoc = (collectionName, id, updatedFields) =>
  updateDoc(doc(collection(db, collectionName), id), updatedFields);

export const onGetDocs = (collectionName, callback) => {
  const unsub = onSnapshot(collection(db, collectionName), callback);
  return unsub;
};

export const getDocList = (collectionName) => getDocs(collection(db, collectionName));

export const removeDoc = (collectionName, id) => deleteDoc(doc(collection(db, collectionName), id));

export const getDocById = (collectionName, id) => getDoc(doc(collection(db, collectionName), id));

export const getDocsByField = (collectionName, field, value, operator) => {
  const q = query(collection(db, collectionName), where(field, operator, value));
  return getDocs(q);
};

export const getDocsByTwoFields = (collectionName, field1, value1, operator1, field2, value2, operator2) => {
  const q = query(collection(db, collectionName), where(field1, operator1, value1), where(field2, operator2, value2));
  return getDocs(q);
};

export const  getDocByField = (collectionName, field, value, operator) => {
  const q = query(collection(db, collectionName), where(field, operator, value), limit(1));
  return getDocs(q);
};

export const getDocByTwoFields = (collectionName, field1, value1, operator1, field2, value2, operator2) => {
  const q = query(collection(db, collectionName), where(field1, operator1, value1), where(field2, operator2, value2), limit(1));
  return getDocs(q);
};

export const getDocByThreeFields = (collectionName, field1, value1, operator1, field2, value2, operator2, field3, value3, operator3) => {
  const q = query(collection(db, collectionName), where(field1, operator1, value1), where(field2, operator2, value2), where(field3, operator3, value3), limit(1));
  return getDocs(q);
};