import { Mapper, NonPrimitive, PlainObject } from './types';
import { isArray, isPlainObject } from 'lodash-es';

const isNonPrimitive = (val: unknown) => !!(isArray(val) || isPlainObject(val));

export const mappingKeys = (
  data: NonPrimitive,
  mapper: Mapper,
): NonPrimitive => {
  if (!isNonPrimitive(data)) {
    return data;
  }
  const mapObj = (obj: PlainObject) => {
    const result: PlainObject = {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        result[mapper(key, val)] = isNonPrimitive(val)
          ? mappingKeys(val as NonPrimitive, mapper)
          : val;
      }
    }
    return result;
  };
  const mapArr = (arr: PlainObject[]) => {
    return arr.map((item) => (isPlainObject(item) ? mapObj(item) : item));
  };
  return isArray(data) ? mapArr(data) : mapObj(data as PlainObject);
};
