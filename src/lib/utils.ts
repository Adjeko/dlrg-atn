export const generateUsername = (name : String) => {
	return `${name}`;
};

export const getImageURL = (collectionId : any, recordId : any, fileName : any, size = '0x0') => {
	return `http://db.dlrgtrack.de/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};