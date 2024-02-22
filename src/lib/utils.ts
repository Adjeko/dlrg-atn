export const generateUsername = (name : String) => {
	return `${name}`;
};

export const getImageURL = (collectionId : any, recordId : any, fileName : any, size = '0x0') => {
	return `http://db.dlrgtrack.de/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const validateData = async (formData : any, schema : any) => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);
		return {
			formData: data,
			errors: null
		};
	} catch (err : any) {
		console.log('Error: ', err);
		const errors = err.flatten();
		return {
			formData: body,
			errors
		};
	}
};

export const serializeNonPOJOs = (obj : any) => {
	return structuredClone(obj);
};