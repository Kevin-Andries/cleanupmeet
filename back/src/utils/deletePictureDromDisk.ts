import fs from 'fs';

export function deletePictureFromDisk(picturePath: string) {
    try {
        fs.unlinkSync(picturePath);
    } catch (err) {
        console.log('FATAL: error while deleting picture from disk:', err);
    }
}
