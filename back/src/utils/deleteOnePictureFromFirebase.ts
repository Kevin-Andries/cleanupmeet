import { firebaseStorage } from './firebase';

export async function deleteOnePictureFromFirebase(
    pictureIdWithExtension: string,
    firebasePictureDestination: string
) {
    const firebasePictureObject = firebaseStorage.file(
        `${firebasePictureDestination}/${pictureIdWithExtension}}`
    );
    await firebasePictureObject.delete();
}
