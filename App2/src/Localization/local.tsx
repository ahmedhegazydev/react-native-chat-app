interface Translation {
  [key: string]: string | Translation;
}

const en: { translation: Translation } = {
  translation: {
    // English Resources..
  },
};

const ar: { translation: Translation } = {
  translation: {
    // Arabic Resources..
  },
};

export { en, ar };
