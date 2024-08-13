/**
 * Create an object composed of the picked object properties
 * @param object - The source object
 * @param keys - An array of keys to pick from the source object
 * @returns An object composed of the picked properties
 */
const pick = <T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> => {
    return keys.reduce((obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = object[key];
      }
      return obj;
    }, {} as Pick<T, K>);
  };
  
  export default pick;