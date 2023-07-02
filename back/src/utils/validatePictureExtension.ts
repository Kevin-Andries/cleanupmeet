const acceptedPictureExtensions = ['.jpeg', '.jpg', '.png', '.gif'];

export default function validatePictureExtension(extension: string) {
    return acceptedPictureExtensions.includes(extension);
}
