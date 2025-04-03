

/**

Converts a camel case string into a phrase with spaces and an initial capital letter.

@param {string} camelCaseString - The camel case string.

@returns {string} - The converted phrase. */

export function camelCaseToTitle(camelCaseString: string) {
    const result = camelCaseString.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }