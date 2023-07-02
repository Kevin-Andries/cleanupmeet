/**
 * This function removes the unnecessary quotes from the error message
 * in order to make it easier to read on the client side
 */
export default (errorMessage: string) => errorMessage.replace(/"/g, '');
