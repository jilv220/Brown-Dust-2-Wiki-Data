export function removeFields<T extends { costume: Record<string, any>[] }>(
  data: Array<T> | string,
  fieldNames: string[]
): Array<T> {
  try {
    const characters = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!Array.isArray(characters)) {
      throw new Error('Input must be an array or JSON string representing an array');
    }

    return characters.map(character => ({
      ...character,
      costume: character.costume.map((item: any) => {
        const newItem = { ...item };
        fieldNames.forEach(field => {
          delete newItem[field];
        });
        return newItem;
      })
    }));
  } catch (error) {
    console.error('Error transforming character data:', error);
    throw error;
  }
}

/**
 * Converts a string from camelCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    // Handle camelCase to snake_case
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    // Handle PascalCase to snake_case
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * Recursively converts all object keys to snake_case
 */
function convertKeysToSnakeCase<T extends object>(obj: T): Record<string, any> {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (item && typeof item === 'object') {
        return convertKeysToSnakeCase(item);
      }
      return item;
    });
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const snakeKey = toSnakeCase(key);
    let processedValue = value;

    if (value && typeof value === 'object') {
      processedValue = convertKeysToSnakeCase(value);
    }

    return {
      ...acc,
      [snakeKey]: processedValue
    };
  }, {});
}

/**
 * Converts object field names to snake_case throughout the data structure
 * @param data Array of objects or JSON string
 * @returns Transformed data with snake_case field names
 */
export function renameToSnakeCase<T extends object>(
  data: Array<T> | string
): Array<Record<string, any>> {
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!Array.isArray(parsedData)) {
      throw new Error('Input must be an array or JSON string representing an array');
    }

    return parsedData.map(item => convertKeysToSnakeCase(item));
  } catch (error) {
    console.error('Error converting to snake case:', error);
    throw error;
  }
}
