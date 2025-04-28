export interface FormCharacterDetails {
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: any;
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  topics: string[];
  adjectives: string[];
  postExamples: string[];
}

export function transformCharacter(jsonData: any): FormCharacterDetails {

  let originalExamples: any[];
  if(jsonData.messageExamples.length > 0) {
    if(Array.isArray(jsonData.messageExamples[0])) {
      if(!jsonData.messageExamples[0][0].content.text) {
        originalExamples = []
      }
    }
  }

  originalExamples = Array.isArray(jsonData.messageExamples)
    ? jsonData.messageExamples
    : [];

  const postExamples = Array.isArray(jsonData.postExamples)
    ? jsonData.postExamples
    : [];

  const formData: FormCharacterDetails = {
    bio: jsonData.bio ?? [],
    lore: jsonData.lore ?? [],
    knowledge: jsonData.knowledge ?? [],
    messageExamples: originalExamples,
    style: jsonData.style ?? { all: [], chat: [], post: [] },
    topics: jsonData.topics ?? [],
    adjectives: jsonData.adjectives ?? [],
    postExamples
  };

  return formData;
}

export function replaceNameInObject(obj, oldName, newName) {
  const regex = new RegExp(oldName, 'gi'); // 'g' = global, 'i' = case-insensitive

  if (typeof obj === 'string') {
    return obj.replace(regex, newName);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceNameInObject(item, oldName, newName));
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replaceNameInObject(obj[key], oldName, newName);
    }
    return newObj;
  }

  return obj; // Return as-is for numbers, booleans, etc.
}
