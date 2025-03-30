import seedrandom from 'seedrandom';
import { faker } from '@faker-js/faker';
import { Book, GenerationParams, Review } from '@/types/book';
import { fakerDE as de, fakerFR as fr, fakerEN_US as en } from '@faker-js/faker';

type SupportedLocale = 'en' | 'de' | 'fr';

const applyTimes = <T>(n: number, fn: (arg: T) => T, initial: T, rng: () => number): T => {
  let result = initial;
  
  const wholePart = Math.floor(n);
  for (let i = 0; i < wholePart; i++) {
    result = fn(result);
  }

  const fractionalPart = n - wholePart;
  if (fractionalPart > 0 && rng() < fractionalPart) {
    result = fn(result);
  }
  
  return result;
};

function getFakerByLocale(locale: string, seed?: string): typeof faker {
  let localizedFaker;
  
  switch (locale) {
    case 'de':
    case 'de-DE':
      localizedFaker = de;
      break;
    case 'fr':
    case 'fr-FR':
      localizedFaker = fr;
      break;
    default:
      localizedFaker = en;
  }

  if (seed) {
    const seedNum = parseInt(seed, 10) || parseInt(seed, 36) || 0;
    localizedFaker.seed(seedNum);
  }
  
  return localizedFaker;
}

const ensureValidLocale = (locale: string): SupportedLocale => {
  return (locale === 'en' || locale === 'de' || locale === 'fr') ? 
    locale as SupportedLocale : 'en';
};

const reviewTemplates: Record<SupportedLocale, Record<string, string[]>> = {
  'en': {
    'positive': [
      "Absolutely loved this book! {title} is {adjective} and kept me engaged from beginning to end.",
      "I couldn't put this down. The characters are {adjective} and the plot is {adjectiveTwo}.",
      "One of the best books I've read this year. {adjective} storytelling that {impactPhrase}.",
      "The author's writing style is {adjective}. {title} is definitely worth reading.",
      "{title} exceeded my expectations. {impactPhrase} - highly recommend!"
    ],
    'negative': [
      "Unfortunately, I found {title} to be {adjective}. The plot was {adjectiveTwo} and didn't hold my interest.",
      "Expected more from this book. The characters felt {adjective} and the story was {adjectiveTwo}.",
      "Struggled to finish this one. The writing was {adjective} and {impactNegPhrase}.",
      "Not the author's best work. {title} was {adjective} and {adjectiveTwo}.",
      "Disappointing read overall. {impactNegPhrase}."
    ]
  },
  'de': {
    'positive': [
      "{title} ist ein {adjective} Buch, das mich von Anfang bis Ende fesselte.",
      "Ich konnte es nicht weglegen. Die Charaktere sind {adjective} und die Handlung ist {adjectiveTwo}.",
      "Eines der besten Bücher, die ich dieses Jahr gelesen habe. {adjective} Erzählweise, die {impactPhrase}.",
      "Der Schreibstil des Autors ist {adjective}. {title} ist definitiv lesenswert.",
      "{title} hat meine Erwartungen übertroffen. {impactPhrase} - sehr zu empfehlen!"
    ],
    'negative': [
      "Leider fand ich {title} {adjective}. Die Handlung war {adjectiveTwo} und hat mein Interesse nicht geweckt.",
      "Ich hatte mehr von diesem Buch erwartet. Die Charaktere wirkten {adjective} und die Geschichte war {adjectiveTwo}.",
      "Ich hatte Mühe, dieses Buch zu beenden. Das Schreiben war {adjective} und {impactNegPhrase}.",
      "Nicht das beste Werk des Autors. {title} war {adjective} und {adjectiveTwo}.",
      "Insgesamt eine enttäuschende Lektüre. {impactNegPhrase}."
    ]
  },
  'fr': {
    'positive': [
      "J'ai adoré ce livre ! {title} est {adjective} et m'a captivé du début à la fin.",
      "Je n'ai pas pu le poser. Les personnages sont {adjective} et l'intrigue est {adjectiveTwo}.",
      "L'un des meilleurs livres que j'ai lus cette année. Une narration {adjective} qui {impactPhrase}.",
      "Le style d'écriture de l'auteur est {adjective}. {title} vaut vraiment la peine d'être lu.",
      "{title} a dépassé mes attentes. {impactPhrase} - fortement recommandé !"
    ],
    'negative': [
      "Malheureusement, j'ai trouvé {title} {adjective}. L'intrigue était {adjectiveTwo} et n'a pas retenu mon intérêt.",
      "J'attendais plus de ce livre. Les personnages semblaient {adjective} et l'histoire était {adjectiveTwo}.",
      "J'ai eu du mal à finir celui-ci. L'écriture était {adjective} et {impactNegPhrase}.",
      "Pas le meilleur travail de l'auteur. {title} était {adjective} et {adjectiveTwo}.",
      "Une lecture décevante dans l'ensemble. {impactNegPhrase}."
    ]
  }
};

const adjectives: Record<SupportedLocale, Record<string, string[]>> = {
  'en': {
    'positive': [
      'captivating', 'brilliant', 'engaging', 'thought-provoking', 'masterful',
      'insightful', 'riveting', 'compelling', 'fascinating', 'immersive',
      'outstanding', 'powerful', 'inspiring', 'moving', 'exceptional'
    ],
    'negative': [
      'tedious', 'disappointing', 'predictable', 'flat', 'confusing',
      'unimaginative', 'disjointed', 'boring', 'pretentious', 'vague',
      'underdeveloped', 'shallow', 'forgettable', 'convoluted', 'lackluster'
    ]
  },
  'de': {
    'positive': [
      'fesselnd', 'brillant', 'ansprechend', 'zum Nachdenken anregend', 'meisterhaft',
      'aufschlussreich', 'mitreißend', 'überzeugend', 'faszinierend', 'immersiv',
      'herausragend', 'kraftvoll', 'inspirierend', 'bewegend', 'außergewöhnlich'
    ],
    'negative': [
      'langweilig', 'enttäuschend', 'vorhersehbar', 'flach', 'verwirrend',
      'fantasielos', 'unzusammenhängend', 'ermüdend', 'prätentiös', 'vage',
      'unterentwickelt', 'oberflächlich', 'vergesslich', 'kompliziert', 'glanzlos'
    ]
  },
  'fr': {
    'positive': [
      'captivant', 'brillant', 'engageant', 'stimulant', 'magistral',
      'perspicace', 'fascinant', 'convaincant', 'passionnant', 'immersif',
      'exceptionnel', 'puissant', 'inspirant', 'émouvant', 'remarquable'
    ],
    'negative': [
      'ennuyeux', 'décevant', 'prévisible', 'plat', 'déroutant',
      'sans imagination', 'décousu', 'lassant', 'prétentieux', 'vague',
      'sous-développé', 'superficiel', 'oubliable', 'alambiqué', 'terne'
    ]
  }
};

const impactPhrases: Record<SupportedLocale, Record<string, string[]>> = {
  'en': {
    'positive': [
      'stays with you long after the final page',
      'transports you to another world',
      'makes you see things in a new light',
      'captivates your imagination',
      'leaves you wanting more',
      'resonates with authentic emotion'
    ],
    'negative': [
      'fails to deliver on its premise',
      'feels like a missed opportunity',
      'never quite comes together',
      'lacks depth and originality',
      'struggles to maintain interest',
      'falls short of expectations'
    ]
  },
  'de': {
    'positive': [
      'bleibt lange nach der letzten Seite bei Ihnen',
      'transportiert Sie in eine andere Welt',
      'lässt Sie die Dinge in einem neuen Licht sehen',
      'fesselt Ihre Fantasie',
      'lässt Sie mehr wollen',
      'resoniert mit authentischen Emotionen'
    ],
    'negative': [
      'hält nicht, was es verspricht',
      'fühlt sich wie eine verpasste Chance an',
      'kommt nie richtig zusammen',
      'es fehlt an Tiefe und Originalität',
      'kämpft darum, das Interesse zu erhalten',
      'erfüllt die Erwartungen nicht'
    ]
  },
  'fr': {
    'positive': [
      'reste avec vous longtemps après la dernière page',
      'vous transporte dans un autre monde',
      'vous fait voir les choses sous un jour nouveau',
      'captive votre imagination',
      'vous laisse en vouloir plus',
      'résonne avec une émotion authentique'
    ],
    'negative': [
      'ne tient pas ses promesses',
      'ressemble à une occasion manquée',
      'ne se rassemble jamais vraiment',
      'manque de profondeur et d\'originalité',
      'peine à maintenir l\'intérêt',
      'ne répond pas aux attentes'
    ]
  }
};

export const generateBooks = (params: GenerationParams, count: number = 20): Book[] => {
  const books: Book[] = []; 
  const usedTitles = new Set<string>();
  const usedISBNs = new Set<string>();
  
  const languageCode = params.language.split('-')[0];
  const locale = ensureValidLocale(languageCode);

  const startIndex = params.offset || 0;
  let index = startIndex;
  
  while (books.length < count) {
    const book = generateBook(
      params.seed, 
      index, 
      locale, 
      params.language,
      params.averageLikes || 100, 
      params.averageReviews || 5
    );

    if (!usedTitles.has(book.title) && !usedISBNs.has(book.isbn)) {
      usedTitles.add(book.title);
      usedISBNs.add(book.isbn);
      books.push(book);
    }
    
    index++;
    
    if (index > startIndex + count * 3) {
      console.warn('Warning: Reached maximum attempts to generate unique books');
      break;
    }
  }
  
  return books;
};

const generateSeedFromRng = (rng: () => number): number => {
  return Math.floor(rng() * 2147483647); 
};

const generateLocaleSpecificDescription = (
  locale: SupportedLocale, 
  baseRng: () => number,
  authors: string[],
  title: string,
  publishYear: number
): string => {
  if (locale === 'en') {
    const themes = [
      'explores the human condition',
      'delves into the complexities of modern life',
      'examines the nature of love and loss',
      'challenges conventional wisdom',
      'paints a vivid portrait of a changing world',
      'offers a glimpse into an unfamiliar reality',
      'weaves together multiple storylines',
      'creates a tapestry of interconnected lives'
    ];
    
    const settings = [
      'against the backdrop of a rapidly changing society',
      'in a world on the brink of transformation',
      'across decades of personal and social upheaval',
      'through the lens of personal experience',
      'within the confines of traditional expectations',
      'through a series of unexpected encounters',
      'amid the chaos of historical events'
    ];
    
    const impacts = [
      'resonates with readers long after the final page',
      'leaves a lasting impression on the literary landscape',
      'has been acclaimed for its insight and originality',
      'stands as a testament to the power of storytelling',
      'challenges readers to reconsider their assumptions',
      'has established itself as an important cultural touchstone'
    ];
    
    const authorName = authors[0];
    const theme = themes[Math.floor(baseRng() * themes.length)];
    const setting = settings[Math.floor(baseRng() * settings.length)];
    const impact = impacts[Math.floor(baseRng() * impacts.length)];
    
    const paragraphs = [
      `"${title}" ${theme} ${setting}. First published in ${publishYear}, this remarkable work has captivated readers with its profound insights and masterful prose.`,
      
      `In this compelling narrative, ${authorName} draws on personal experiences and meticulous research to create characters of extraordinary depth and authenticity. The story unfolds with precision and grace, revealing layers of meaning with each new chapter.`,
      
      `Critics have praised the book's innovative structure and evocative language. It ${impact}, cementing ${authorName}'s reputation as one of the most significant voices in contemporary literature.`
    ];
    
    return paragraphs.join('\n\n');
  }
  else if (locale === 'de') {
    const themes = [
      'untersucht die menschliche Existenz',
      'vertieft sich in die Komplexität des modernen Lebens',
      'erforscht das Wesen von Liebe und Verlust',
      'stellt konventionelle Weisheiten in Frage',
      'zeichnet ein lebendiges Porträt einer sich verändernden Welt',
      'bietet einen Einblick in eine unbekannte Realität',
      'verwebt mehrere Handlungsstränge miteinander',
      'erschafft ein Geflecht aus verbundenen Leben'
    ];
    
    const settings = [
      'vor dem Hintergrund einer sich schnell verändernden Gesellschaft',
      'in einer Welt am Rande der Transformation',
      'über Jahrzehnte persönlicher und sozialer Umwälzungen',
      'durch die Linse persönlicher Erfahrung',
      'innerhalb der Grenzen traditioneller Erwartungen',
      'durch eine Reihe unerwarteter Begegnungen',
      'inmitten des Chaos historischer Ereignisse'
    ];
    
    const impacts = [
      'hallt bei den Lesern noch lange nach der letzten Seite nach',
      'hinterlässt einen bleibenden Eindruck in der literarischen Landschaft',
      'wurde für seinen Einblick und seine Originalität gelobt',
      'steht als Zeugnis für die Kraft des Geschichtenerzählens',
      'fordert die Leser heraus, ihre Annahmen zu überdenken',
      'hat sich als wichtiger kultureller Meilenstein etabliert'
    ];
    
    const authorName = authors[0];
    const theme = themes[Math.floor(baseRng() * themes.length)];
    const setting = settings[Math.floor(baseRng() * settings.length)];
    const chosenImpact = impacts[Math.floor(baseRng() * impacts.length)]; 
    
    const paragraphs = [
      `"${title}" ${theme} ${setting}. Erstmals veröffentlicht im Jahr ${publishYear}, hat dieses bemerkenswerte Werk Leser mit seinen tiefgründigen Einsichten und meisterhafter Prosa gefesselt.`,
      
      `In dieser fesselnden Erzählung greift ${authorName} auf persönliche Erfahrungen und akribische Recherchen zurück, um Charaktere von außergewöhnlicher Tiefe und Authentizität zu schaffen. Die Geschichte entfaltet sich mit Präzision und Anmut und offenbart mit jedem neuen Kapitel neue Bedeutungsebenen.`,
      
      `Kritiker haben die innovative Struktur und die ausdrucksvolle Sprache des Buches gelobt. Es ${chosenImpact}, und festigt ${authorName}s Ruf als eine der bedeutendsten Stimmen der zeitgenössischen Literatur.`
    ];
    
    return paragraphs.join('\n\n');
  }
  else { 
    const themes = [
      'explore la condition humaine',
      'plonge dans les complexités de la vie moderne',
      'examine la nature de l\'amour et de la perte',
      'remet en question la sagesse conventionnelle',
      'peint un portrait vivant d\'un monde en changement',
      'offre un aperçu d\'une réalité inconnue',
      'tisse ensemble plusieurs intrigues',
      'crée une tapisserie de vies interconnectées'
    ];
    
    const settings = [
      'sur fond de société en mutation rapide',
      'dans un monde au bord de la transformation',
      'à travers des décennies de bouleversements personnels et sociaux',
      'à travers le prisme de l\'expérience personnelle',
      'dans les limites des attentes traditionnelles',
      'à travers une série de rencontres inattendues',
      'au milieu du chaos des événements historiques'
    ];
    
    const impacts = [
      'résonne avec les lecteurs longtemps après la dernière page',
      'laisse une impression durable sur le paysage littéraire',
      'a été acclamé pour sa perspicacité et son originalité',
      'se dresse comme un témoignage de la puissance de la narration',
      'incite les lecteurs à reconsidérer leurs hypothèses',
      's\'est imposé comme une référence culturelle importante'
    ];
    
    const authorName = authors[0];
    const theme = themes[Math.floor(baseRng() * themes.length)];
    const setting = settings[Math.floor(baseRng() * settings.length)];
    const impact = impacts[Math.floor(baseRng() * impacts.length)];
    
    const paragraphs = [
      `"${title}" ${theme} ${setting}. Publié pour la première fois en ${publishYear}, cette œuvre remarquable a captivé les lecteurs par ses réflexions profondes et sa prose magistrale.`,
      
      `Dans ce récit captivant, ${authorName} s'appuie sur des expériences personnelles et des recherches méticuleuses pour créer des personnages d'une profondeur et d'une authenticité extraordinaires.`,
      
      `Les critiques ont salué la structure innovante et le langage évocateur du livre. Il ${impact}, consolidant la réputation de ${authorName} comme l'une des voix les plus significatives de la littérature contemporaine.`
    ];
    
    return paragraphs.join('\n\n');
  }
};

const generateBookCover = (
  bookSeed: string,
  title: string,
  authors: string[]
): string => {
  const coverRng = seedrandom(`${bookSeed}-cover`);

  const width = 300;
  const height = 450;

  const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const authorHash = authors.length > 0 ? 
    authors[0].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;

  const genreKeywords = {
    // English keywords
    fiction: ['novel', 'story', 'tales', 'adventure', 'mystery', 'secret', 'journey', 'chronicles'],
    fantasy: ['magic', 'dragon', 'wizard', 'sword', 'kingdom', 'quest', 'myth', 'legend', 'fairy'],
    scifi: ['space', 'future', 'robot', 'alien', 'planet', 'star', 'galaxy', 'cyberpunk', 'tech'],
    romance: ['love', 'passion', 'heart', 'marriage', 'affair', 'romantic', 'desire', 'emotion'],
    history: ['history', 'ancient', 'medieval', 'century', 'empire', 'king', 'queen', 'war', 'revolution'],
    biography: ['life', 'memoir', 'autobiography', 'biography', 'journal', 'diary', 'letters'],
    business: ['business', 'management', 'leadership', 'entrepreneur', 'success', 'strategy', 'career'],
    nature: ['nature', 'mountain', 'ocean', 'forest', 'river', 'garden', 'landscape', 'wildlife'],
    art: ['art', 'painting', 'sculpture', 'design', 'photography', 'architecture', 'creative', 'aesthetic'],
    
    // German keywords
    fiktion: ['roman', 'geschichte', 'erzählung', 'abenteuer', 'geheimnis', 'reise', 'chronik'],
    fantasie: ['magie', 'drachen', 'zauberer', 'schwert', 'königreich', 'quest', 'mythos', 'legende'],
    sciencefiction: ['weltraum', 'zukunft', 'roboter', 'alien', 'planet', 'stern', 'galaxie', 'technik'],
    romantik: ['liebe', 'leidenschaft', 'herz', 'heirat', 'affäre', 'romantisch', 'verlangen', 'emotion'],
    historie: ['geschichte', 'antik', 'mittelalter', 'jahrhundert', 'reich', 'könig', 'königin', 'krieg'],
    biografie: ['leben', 'memoiren', 'autobiographie', 'biographie', 'tagebuch', 'briefe'],
    
    // French keywords
    romanesque: ['roman', 'histoire', 'conte', 'aventure', 'mystère', 'secret', 'voyage', 'chroniques'],
    fantastique: ['magie', 'dragon', 'sorcier', 'épée', 'royaume', 'quête', 'mythe', 'légende'],
    sciencefiction_fr: ['espace', 'futur', 'robot', 'extraterrestre', 'planète', 'étoile', 'galaxie'],
    romance_fr: ['amour', 'passion', 'cœur', 'mariage', 'liaison', 'romantique', 'désir', 'émotion'],
    histoire: ['histoire', 'ancien', 'médiéval', 'siècle', 'empire', 'roi', 'reine', 'guerre', 'révolution'],
    biographie_fr: ['vie', 'mémoire', 'autobiographie', 'biographie', 'journal', 'lettres']
  };

  let titleLanguage = 'en';
  if (/[äöüßÄÖÜ]/.test(title)) {
    titleLanguage = 'de';
  } else if (/[éèêëàâçîïôùûüÿœæÉÈÊËÀÂÇÎÏÔÙÛÜŸŒÆ]/.test(title)) {
    titleLanguage = 'fr';
  }

  const lowerTitle = title.toLowerCase();
  let bookGenre = 'general';  

  if (titleLanguage === 'de') {
    if (lowerTitle.includes('roman') || lowerTitle.includes('geschichte')) bookGenre = 'fiction';
    else if (lowerTitle.includes('magie') || lowerTitle.includes('drachen')) bookGenre = 'fantasy';
    else if (lowerTitle.includes('weltraum') || lowerTitle.includes('zukunft')) bookGenre = 'scifi';
    else if (lowerTitle.includes('liebe') || lowerTitle.includes('romantisch')) bookGenre = 'romance';
    else if (lowerTitle.includes('geschichte') || lowerTitle.includes('jahrhundert')) bookGenre = 'history';
    else if (lowerTitle.includes('leben') || lowerTitle.includes('autobiographie')) bookGenre = 'biography';
  }
  else if (titleLanguage === 'fr') {
    if (lowerTitle.includes('roman') || lowerTitle.includes('histoire')) bookGenre = 'fiction';
    else if (lowerTitle.includes('magie') || lowerTitle.includes('dragon')) bookGenre = 'fantasy';
    else if (lowerTitle.includes('espace') || lowerTitle.includes('futur')) bookGenre = 'scifi';
    else if (lowerTitle.includes('amour') || lowerTitle.includes('passion')) bookGenre = 'romance';
    else if (lowerTitle.includes('histoire') || lowerTitle.includes('siècle')) bookGenre = 'history';
    else if (lowerTitle.includes('vie') || lowerTitle.includes('biographie')) bookGenre = 'biography';
  } else {
    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        if (genre === 'fiktion' || genre === 'romanesque') bookGenre = 'fiction';
        else if (genre === 'fantasie' || genre === 'fantastique') bookGenre = 'fantasy';
        else if (genre === 'sciencefiction' || genre === 'sciencefiction_fr') bookGenre = 'scifi';
        else if (genre === 'romantik' || genre === 'romance_fr') bookGenre = 'romance';
        else if (genre === 'historie' || genre === 'histoire') bookGenre = 'history';
        else if (genre === 'biografie' || genre === 'biographie_fr') bookGenre = 'biography';
        else bookGenre = genre;
        break;
      }
    }
  }
  const combinedHash = titleHash + authorHash;
  const imageIndex = combinedHash % 1000; 

  const genreVariant = Math.floor(coverRng() * 10); 

  const safeAuthorName = authors.length > 0 ? 
    encodeURIComponent(authors[0].substring(0, 20).replace(/[^\w]/g, '-')) : 
    'unknown';

  if (coverRng() < 0.6) {
    const imageId = (imageIndex % 200) + 1;

    let effect = '';
    if (coverRng() > 0.7) {
      switch (bookGenre) {
        case 'history':
        case 'biography':
          effect = '?grayscale';
          break;
        case 'scifi':
        case 'fantasy':
          effect = '?blur=1';
          break;
        default:
          if (coverRng() > 0.9) {
            if (bookGenre === 'romance') {
              effect = '?blur=1';
            } else if (bookGenre === 'art') {
              effect = '?grayscale';
            }
          }
      }
    }
    
    return `https://picsum.photos/seed/${bookSeed}-${imageId}/${width}/${height}${effect}?author=${safeAuthorName}`;
  } else {
    const uniqueSeed = `${bookSeed}-${titleLanguage}-${bookGenre}-${imageIndex}-${genreVariant}`;

    const finalWidth = coverRng() > 0.95 ? Math.round(width * 0.9) : width;
    const finalHeight = coverRng() > 0.95 ? Math.round(height * 1.1) : height;
    
    return `https://picsum.photos/seed/${uniqueSeed}/${finalWidth}/${finalHeight}?author=${safeAuthorName}`;
  }
};

const generateBook = (
  bookSeed: string, 
  index: number, 
  locale: SupportedLocale,
  fullLocale: string,
  averageLikes: number, 
  averageReviews: number
): Book => {
  const uniqueBookIdentifier = `book-${index}`;
  const combinedBookSeed = `${bookSeed}-${uniqueBookIdentifier}`;
  
  const baseRng = seedrandom(combinedBookSeed);
  const titleRng = seedrandom(`${combinedBookSeed}-title`);
  const authorRng = seedrandom(`${combinedBookSeed}-author`);
  const publisherRng = seedrandom(`${combinedBookSeed}-publisher`);
  const likesRng = seedrandom(`${combinedBookSeed}-likes`);
  const reviewsRng = seedrandom(`${combinedBookSeed}-reviews`);
  const dateRng = seedrandom(`${combinedBookSeed}-date`);
  const pageRng = seedrandom(`${combinedBookSeed}-pages`);

  const seedValue = generateSeedFromRng(baseRng);
  const localizedFaker = getFakerByLocale(locale, seedValue.toString());

  const currentYear = new Date().getFullYear();
  const publicationYear = Math.floor(dateRng() * (currentYear - 1950 + 1)) + 1950;
  const publicationMonth = Math.floor(dateRng() * 12);
  const publicationDay = Math.floor(dateRng() * 28) + 1; 
  const publicationDate = new Date(publicationYear, publicationMonth, publicationDay);

  const pageCount = Math.floor(pageRng() * (800 - 100 + 1)) + 100;

  const title = generateRealisticTitle(locale, titleRng, localizedFaker);
  
  const fullLocaleHash = fullLocale.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const uniqueLocaleIdentifier = `${fullLocale}-${bookSeed}-${uniqueBookIdentifier}-${fullLocaleHash}`;
  
  const authors = generateAuthors(locale, uniqueLocaleIdentifier, authorRng, localizedFaker);
  const publisher = generatePublisher(locale, uniqueLocaleIdentifier, publisherRng, localizedFaker);
  const likes = generateLikes(averageLikes, likesRng);
  
  const bookDescription = generateLocaleSpecificDescription(
    locale, 
    baseRng, 
    authors, 
    title,
    publicationYear
  );

  const coverImage = generateBookCover(combinedBookSeed, title, authors);

  const book: Book = {
    id: index,
    isbn: generateISBN(`${bookSeed}-${uniqueBookIdentifier}`),
    title,
    authors,
    publisher,
    coverImage,
    likes,
    reviews: [],
    description: bookDescription,
    publicationDate,
    pageCount
  };

  book.reviews = generateReviews(
    averageReviews, 
    locale,
    fullLocale, 
    `${bookSeed}-${uniqueBookIdentifier}`, 
    publicationDate,
    reviewsRng, 
    localizedFaker,
    title
  );
  
  return book;
};

const generateISBN = (seed: string): string => {
  const rng = seedrandom(`${seed}-isbn`);
  const groups: number[] = [];

  groups.push(rng() < 0.9 ? 978 : 979);
  groups.push(Math.floor(rng() * 10));
  groups.push(Math.floor(rng() * 900) + 100);
  groups.push(Math.floor(rng() * 900000) + 100000);
  const checkDigit = Math.floor(rng() * 10);
  groups.push(checkDigit);
  const isbn = groups.join('-');
  
  return isbn;
};

const generateRealisticTitle = (
  locale: SupportedLocale,
  rng: () => number,
  localizedFaker: typeof faker
): string => {
  const titles = [
    // Literary fiction
    () => `${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}`,
    () => `The ${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}`,
    () => `${localizedFaker.word.noun()} of ${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}`,
    
    // Memoir style
    () => `${localizedFaker.word.preposition()} the ${localizedFaker.word.noun()}`,
    () => `${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}: A Memoir`,
    
    // Academic/non-fiction style
    () => `The ${localizedFaker.word.noun()} of ${localizedFaker.word.noun()}`,
    () => `${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}: ${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}`,
    
    // Genre fiction
    () => `${localizedFaker.person.firstName()}'s ${localizedFaker.word.noun()}`,
    () => `${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}: Book ${Math.floor(rng() * 9) + 1}`,
    () => `The ${localizedFaker.word.noun()} ${localizedFaker.word.adjective()} ${localizedFaker.word.noun()}`,
    
    // Time-based
    () => `${localizedFaker.date.month()} ${localizedFaker.word.noun()}`,
    () => `The Last ${localizedFaker.word.noun()} of ${localizedFaker.date.month()}`,
    
    // Location-based
    () => `The ${localizedFaker.word.noun()} of ${localizedFaker.location.city()}`,
    () => `${localizedFaker.location.city()} ${localizedFaker.word.noun()}`,
  ];

  let title = titles[Math.floor(rng() * titles.length)]();

  title = title.split(' ').map(word => {
    if (['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in'].includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
  
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  return title;
}


const generateAuthors = (
  locale: SupportedLocale, 
  fullLocale: string,
  rng: () => number, 
  localizedFaker: typeof faker
): string[] => {
  if (!localizedFaker) throw new Error('localizedFaker is required');


  const uniqueAuthorSeed = `${fullLocale}-authors`;
  const authorRngUnique = seedrandom(uniqueAuthorSeed);

  const authorCount = authorRngUnique() < 0.3 ? 2 : 1;
  const authors: string[] = [];

  const englishFirstNames = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
    'Margaret', 'Nancy', 'Lisa', 'Betty', 'Dorothy', 'Sandra', 'Ashley', 'Kimberly', 'Donna', 'Emily',
    'Edward', 'George', 'Harry', 'Samuel', 'Benjamin', 'Jackson', 'Raymond', 'Roy', 'Peter', 'Alexander',
    'Katherine', 'Christine', 'Deborah', 'Rachel', 'Carol', 'Amanda', 'Melissa', 'Laura', 'Rebecca', 'Michelle'
  ];
  
  const germanFirstNames = [
    'Hans', 'Wolfgang', 'Klaus', 'Jürgen', 'Dieter', 'Manfred', 'Gerhard', 'Günter', 'Peter', 'Heinz',
    'Helga', 'Ursula', 'Ingrid', 'Renate', 'Gisela', 'Monika', 'Karin', 'Erika', 'Elke', 'Sabine',
    'Andreas', 'Thomas', 'Stefan', 'Michael', 'Christian', 'Jörg', 'Uwe', 'Frank', 'Bernd', 'Matthias',
    'Gabriele', 'Angelika', 'Martina', 'Claudia', 'Birgit', 'Heike', 'Andrea', 'Petra', 'Susanne', 'Bettina',
    'Friedrich', 'Otto', 'Karl', 'Werner', 'Heinrich', 'Rainer', 'Rolf', 'Walter', 'Martin', 'Horst',
    'Christa', 'Brigitte', 'Hannelore', 'Barbara', 'Ulrike', 'Inge', 'Uta', 'Jutta', 'Silvia', 'Dagmar'
  ];
  
  const frenchFirstNames = [
    'Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'René', 'Louis', 'François', 'Claude', 'Jacques',
    'Marie', 'Jeanne', 'Françoise', 'Catherine', 'Monique', 'Nicole', 'Sylvie', 'Anne', 'Isabelle', 'Sophie',
    'Bernard', 'Daniel', 'Christian', 'Patrick', 'Alain', 'Christophe', 'Laurent', 'Thierry', 'Pascal', 'Éric',
    'Nathalie', 'Martine', 'Véronique', 'Christine', 'Chantal', 'Valérie', 'Céline', 'Julie', 'Caroline', 'Aurélie',
    'Henri', 'Marcel', 'Paul', 'Antoine', 'Yves', 'Maurice', 'Gérard', 'Mathieu', 'Victor', 'Lucien',
    'Hélène', 'Marguerite', 'Juliette', 'Brigitte', 'Jacqueline', 'Suzanne', 'Claire', 'Geneviève', 'Élise', 'Thérèse'
  ];

  const englishLastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
    'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
    'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
    'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'
  ];
  
  const germanLastNames = [
    'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 
    'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch'
  ];
  
  const frenchLastNames = [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard',
    'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent'
  ];
 
  const usedFirstNames = new Set();
  
  for (let i = 0; i < authorCount; i++) {
    const authorSeed = `${uniqueAuthorSeed}-${i}`;
    const authorRng = seedrandom(authorSeed);

    let authorName = "";
    let firstName = "";
    let lastName = "";

    if (locale === 'en') {
      do {
        firstName = englishFirstNames[Math.floor(authorRng() * englishFirstNames.length)];
      } while (usedFirstNames.has(firstName));
      
      usedFirstNames.add(firstName);
      lastName = englishLastNames[Math.floor(authorRng() * englishLastNames.length)];

      const useMiddleInitial = authorRng() < 0.3;
      if (useMiddleInitial) {
        const middleInitial = String.fromCharCode(65 + Math.floor(authorRng() * 26));
        authorName = `${firstName} ${middleInitial}. ${lastName}`;
      } else {
        authorName = `${firstName} ${lastName}`;
      }
    } 
    else if (locale === 'de') {
      do {
        firstName = germanFirstNames[Math.floor(authorRng() * germanFirstNames.length)];
      } while (usedFirstNames.has(firstName));
      
      usedFirstNames.add(firstName);
      lastName = germanLastNames[Math.floor(authorRng() * germanLastNames.length)];

      const useTitle = authorRng() < 0.2;
      if (useTitle) {
        const titles = ['Dr.', 'Prof.', 'Prof. Dr.'];
        const title = titles[Math.floor(authorRng() * titles.length)];
        authorName = `${title} ${firstName} ${lastName}`;
      } else {
        authorName = `${firstName} ${lastName}`;
      }
    } 
    else if (locale === 'fr') {
      do {
        firstName = frenchFirstNames[Math.floor(authorRng() * frenchFirstNames.length)];
      } while (usedFirstNames.has(firstName));
      
      usedFirstNames.add(firstName);
      lastName = frenchLastNames[Math.floor(authorRng() * frenchLastNames.length)];

      const useCompound = authorRng() < 0.2;
      if (useCompound) {
        let secondName;
        do {
          secondName = frenchFirstNames[Math.floor(authorRng() * frenchFirstNames.length)];
        } while (secondName === firstName || usedFirstNames.has(secondName)); 
        
        usedFirstNames.add(secondName);
        authorName = `${firstName}-${secondName} ${lastName}`;
      } else {
        authorName = `${firstName} ${lastName}`;
      }
    }
    
    authors.push(authorName);
  }
  
  return authors;
};

const generatePublisher = (
  locale: SupportedLocale, 
  fullLocale: string,
  rng: () => number,
  localizedFaker: typeof faker
): string => {
  const publisherTypes = {
    'en': ['Books', 'Publishing', 'Press', 'House', 'Media', 'Publications'],
    'de': ['Bücher', 'Verlag', 'Presse', 'Haus', 'Medien', 'Publikationen'],
    'fr': ['Livres', 'Édition', 'Presse', 'Maison', 'Médias', 'Publications']
  };
  
  const types = publisherTypes[locale];
  const pattern = Math.floor(rng() * 4);
  let publisherName = '';
  
  switch (pattern) {
    case 0:
      publisherName = localizedFaker.company.name();
      break;
    case 1:
      publisherName = `${localizedFaker.location.city()} ${types[Math.floor(rng() * types.length)]}`;
      break;
    case 2:
      publisherName = `${localizedFaker.person.lastName()} ${types[Math.floor(rng() * types.length)]}`;
      break;
    case 3:
      const cities = {
        'en': ['Oxford', 'Cambridge', 'Chicago', 'Harvard', 'Yale', 'Princeton'],
        'de': ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Heidelberg'],
        'fr': ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg', 'Toulouse']
      };
      const city = cities[locale][Math.floor(rng() * cities[locale].length)];
      
      if (locale === 'en') {
        publisherName = `${city} University Press`;
      } else if (locale === 'de') {
        publisherName = `${city}er Universitätsverlag`;
      } else if (locale === 'fr') {
        publisherName = `Presses Universitaires de ${city}`;
      }
      break;
  }

  return publisherName;
};

const generateLikes = (averageLikes: number, rng: () => number): number => {
  const sanitizedAverageLikes = isNaN(averageLikes) ? 0 : Math.max(0, averageLikes);

  return applyTimes(
    sanitizedAverageLikes,
    (count) => count + 1,
    0,
    rng
  );
};

const reviewerFirstNames: Record<SupportedLocale, string[]> = {
  'en': [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Mary', 'Patricia', 
    'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Emily'
  ],
  'de': [
    'Hans', 'Wolfgang', 'Klaus', 'Jürgen', 'Peter', 'Helga', 'Ursula', 'Ingrid',
    'Renate', 'Monika', 'Karin', 'Erika', 'Andrea', 'Thomas', 'Stefan'
  ],
  'fr': [
    'Jean', 'Pierre', 'Michel', 'André', 'Marie', 'Jeanne', 'Françoise',
    'Catherine', 'Nicole', 'Sylvie', 'Anne', 'Bernard', 'Daniel', 'Patrick', 'Laurent'
  ]
};

const reviewerLastNames: Record<SupportedLocale, string[]> = {
  'en': [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 
    'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson'
  ],
  'de': [
    'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 
    'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch'
  ],
  'fr': [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard',
    'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent'
  ]
};

const generateReviews = (
  averageReviews: number,
  locale: SupportedLocale,
  fullLocale: string,
  seed: string,
  publicationDate: Date,
  baseRng: () => number,
  localizedFaker: typeof faker,
  title: string
): Review[] => {
  const sanitizedAverageReviews = isNaN(averageReviews) ? 0 : Math.max(0, averageReviews);
  const reviewCount = applyTimes(
    sanitizedAverageReviews,
    (count) => count + 1,
    0,
    baseRng
  );
  
  const reviews: Review[] = [];
  
  const originalSeed = localizedFaker.seed();
  
  const usedReviewerNames = new Set();

  for (let i = 0; i < reviewCount; i++) {
    const reviewSeed = `${fullLocale}-${seed}-review-${i}`;
    const reviewRng = seedrandom(reviewSeed);

    const pubDate = new Date(publicationDate);
    const currentDate = new Date();
    const reviewTimeGap = reviewRng() * (currentDate.getTime() - pubDate.getTime());
    const reviewDate = new Date(pubDate.getTime() + reviewTimeGap);

    let rating;
    const ratingRoll = reviewRng();
    if (ratingRoll < 0.15) {
      rating = 1 + Math.floor(reviewRng() * 2); 
    } else if (ratingRoll < 0.30) {
      rating = 3; 
    } else {
      rating = 4 + Math.floor(reviewRng() * 2); 
    }
  
    const isPositive = rating >= 3;
    const sentiment = isPositive ? 'positive' : 'negative';

    let firstName, lastName, reviewerName;
    
    do {
      firstName = reviewerFirstNames[locale][Math.floor(reviewRng() * reviewerFirstNames[locale].length)];
      lastName = reviewerLastNames[locale][Math.floor(reviewRng() * reviewerLastNames[locale].length)];
      reviewerName = `${firstName} ${lastName}`;
    } while (usedReviewerNames.has(reviewerName));
    
    usedReviewerNames.add(reviewerName);

    const templates = reviewTemplates[locale][sentiment];
    const template = templates[Math.floor(reviewRng() * templates.length)];

    const adjectivePool = adjectives[locale][sentiment];
    const adjective = adjectivePool[Math.floor(reviewRng() * adjectivePool.length)];
    const adjectiveTwo = adjectivePool[Math.floor(reviewRng() * adjectivePool.length)];
    
    const impactPool = impactPhrases[locale][sentiment];
    const impactPhrase = impactPool[Math.floor(reviewRng() * impactPool.length)];
    const impactNegPhrase = impactPhrases[locale]['negative'][Math.floor(reviewRng() * impactPhrases[locale]['negative'].length)];
    
    let reviewText = template
      .replace('{title}', title)
      .replace('{adjective}', adjective)
      .replace('{adjectiveTwo}', adjectiveTwo)
      .replace('{impactPhrase}', impactPhrase)
      .replace('{impactNegPhrase}', impactNegPhrase);

    if (reviewRng() > 0.5) {
      if (locale === 'en') {
        reviewText += isPositive ? " I'd definitely recommend it to others." : " Unfortunately, I can't recommend this one.";
      } else if (locale === 'de') {
        reviewText += isPositive ? " Ich würde es definitiv anderen empfehlen." : " Leider kann ich dieses Buch nicht empfehlen.";
      } else {
        reviewText += isPositive ? " Je le recommanderais certainement à d'autres." : " Malheureusement, je ne peux pas recommander celui-ci.";
      }
    }
    
    reviews.push({
      id: i + 1,
      author: reviewerName,
      text: reviewText.trim(),
      rating: rating,
      date: reviewDate
    });
  }

  localizedFaker.seed(originalSeed);

  reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return reviews;
};