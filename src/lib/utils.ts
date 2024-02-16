export const serializeNonPOJOs = (obj : any) => {
  structuredClone(obj)
}


export const generateUsername = (name : String) => {
	return `${name}`;
};