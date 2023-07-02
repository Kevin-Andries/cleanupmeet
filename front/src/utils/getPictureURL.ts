import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { firebaseAppObject } from "./firebase";

export async function getPictureURL(pictureId: string) {
  const storage = getStorage(firebaseAppObject);
  const storageRef = ref(storage, "profilePicture/" + pictureId);
  const url = await getDownloadURL(storageRef).catch(() => {});
  return url;
}
