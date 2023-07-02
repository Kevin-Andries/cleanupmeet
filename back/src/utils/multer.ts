import multer from 'multer';

const multerUploadOnePicture = multer({
    dest: 'uploadedPictures/',
    limits: {
        fileSize:
            parseInt(process.env.EVENT_PICTURE_SIZE_LIMIT_IN_MB as string) *
            1048576,
    },
});

export function uploadOnePicture(pictureName: string) {
    return multerUploadOnePicture.single(pictureName);
}
