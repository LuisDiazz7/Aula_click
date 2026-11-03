// La PAES no incluye prueba de Inglés: este material es de refuerzo escolar.
const NO_PAES = 'Inglés · Refuerzo escolar (no evaluado en la PAES)'

export default [
  {
    slug: 'skimming-scanning',
    nombre: 'Skimming and scanning',
    paes: NO_PAES,
    resumen:
      'Skimming y scanning son dos estrategias de lectura rápida. Te ayudan a entender textos en inglés sin traducir cada palabra.',
    claves: [
      'Skimming: leer rápido para captar la idea general (gist). Mira el título, los subtítulos, la primera y la última oración de cada párrafo.',
      'Scanning: buscar un dato específico (fecha, número, nombre, palabra clave) sin leer todo.',
      'Usa skimming para responder "What is the text about?" y scanning para "When…?", "How many…?", "Where…?".',
      'Apóyate en los cognados: palabras parecidas al español (national, famous, glaciers).',
    ],
    consejo:
      'Antes de leer, revisa las preguntas: si piden un dato puntual, haz scanning; si piden la idea principal, haz skimming.',
    lectura: {
      titulo: 'Visit Torres del Paine',
      texto:
        'Torres del Paine National Park is located in the Magallanes Region, in southern Chile. It was declared a UNESCO Biosphere Reserve in 1978. The park is famous for its granite towers, glaciers and turquoise lakes.\n' +
        'Thousands of hikers arrive every year to complete the "W" trek, a route that usually takes four to five days. The best time to visit is between October and April, when the weather is milder. Visitors must book their campsites in advance, and fires are strictly forbidden outside designated areas.',
    },
    ejercicios: [
      ['(Scanning) In which year was the park declared a Biosphere Reserve?', ['1978', '1987', '1959', '2001'], 'A', 'The date appears in the first paragraph.'],
      ['(Skimming) What is the text mainly about?', ['A general description of the park and tips for visitors', 'The history of Chilean glaciers', 'How to cook while camping', 'The biography of a famous hiker'], 'A', 'It describes the park and gives practical information.'],
      ['How long does the "W" trek usually take?', ['One day', 'Two weeks', 'Four to five days', 'Ten days'], 'C', '"…a route that usually takes four to five days."'],
      ['When is the best time to visit the park?', ['From May to September', 'From October to April', 'Only in July', 'All year with the same weather'], 'B', '"…between October and April, when the weather is milder."'],
      ['In the text, the word "forbidden" means:', ['permitido', 'prohibido', 'recomendado', 'gratuito'], 'B', 'Fires are not allowed outside designated areas.'],
      ['Which strategy is best to find a phone number in a brochure?', ['Scanning', 'Skimming', 'Translating every word', 'Reading only the conclusion'], 'A', 'Scanning is used to find specific data.'],
      ['Skimming consists of:', ['reading every word carefully', 'reading titles, first sentences and key words to get the general idea', 'memorizing the text', 'looking up every word in the dictionary'], 'B', 'Its goal is the gist of the text.'],
      ['Where is the park located?', ['In northern Chile', 'On Easter Island', 'In the Magallanes Region, southern Chile', 'In Santiago'], 'C', 'Stated in the first sentence.'],
    ],
  },
  {
    slug: 'reading-strategies',
    nombre: 'Reading strategies',
    paes: NO_PAES,
    resumen:
      'Leer en inglés es más fácil si usas estrategias: predecir, aprovechar lo que ya sabes, deducir palabras por el contexto e identificar a qué se refieren los pronombres.',
    claves: [
      'Predicting: anticipa el contenido a partir del título y las imágenes.',
      'Cognates: palabras parecidas al español (population, important). False friends: parecen iguales pero no lo son (actually = en realidad; embarrassed = avergonzado).',
      'Context clues: deduce el significado de una palabra por las oraciones que la rodean.',
      'Reference words: it, they, this, them remiten a algo mencionado antes.',
      'Main idea vs. supporting details: la idea principal resume el texto; los detalles la respaldan.',
    ],
    consejo:
      'No te detengas en cada palabra desconocida: sigue leyendo y vuelve a ella si es necesaria para responder.',
    lectura: {
      titulo: 'Bees and Our Food',
      texto:
        'Bees are small, but their job is enormous. When they fly from flower to flower, they carry pollen, which allows plants to produce fruits and seeds. In fact, about one third of the food we eat depends on pollinators like them.\n' +
        'Unfortunately, bee populations have declined in many countries because of pesticides, habitat loss and climate change. Some farmers are now planting wildflowers next to their crops. This simple action gives bees food and shelter, and it can also increase harvests.',
    },
    ejercicios: [
      ['What is the main idea of the text?', ['Bees are important for food production and need protection', 'Bees are dangerous insects', 'Farmers do not like wildflowers', 'Climate change only affects bees'], 'A', 'The text explains their role and the threats they face.'],
      ['In "their job is enormous", the word "their" refers to:', ['flowers', 'bees', 'farmers', 'seeds'], 'B', 'The sentence begins with "Bees are small…".'],
      ['"This simple action" refers to:', ['using pesticides', 'planting wildflowers next to crops', 'eating fruit', 'flying from flower to flower'], 'B', 'It refers to the previous sentence.'],
      ['Which of these is a supporting detail?', ['About one third of the food we eat depends on pollinators', 'Bees are small', 'Farmers grow crops', 'Flowers are colorful'], 'A', 'It supports the idea that bees are important for food.'],
      ['From the context, "declined" probably means:', ['aumentado', 'disminuido', 'viajado', 'florecido'], 'B', 'Pesticides and habitat loss reduce populations.'],
      ['The word "actually" means:', ['actualmente', 'en realidad', 'activamente', 'rápidamente'], 'B', 'It is a false friend.'],
      ['Which word is a cognate?', ['shelter', 'harvest', 'population', 'wildflower'], 'C', '"Population" is very similar to "población".'],
      ['Looking at the title and images before reading is called:', ['predicting', 'scanning for numbers', 'translating', 'summarizing'], 'A', 'It helps to anticipate the content.'],
    ],
  },
  {
    slug: 'verb-tenses',
    nombre: 'Verb tenses',
    paes: NO_PAES,
    resumen:
      'Los tiempos verbales indican cuándo ocurre una acción. Reconocerlos permite comprender el orden de los hechos en un texto.',
    claves: [
      'Present simple: hábitos y hechos. She works every day. (3ª persona singular agrega -s).',
      'Present continuous: acciones que ocurren ahora. She is working now.',
      'Past simple: acciones terminadas en el pasado. She worked yesterday.',
      'Past continuous: acción en desarrollo interrumpida. I was cooking when you called.',
      'Present perfect (have/has + participio): experiencias o acciones que continúan. I have lived here since 2019.',
      'Future: will (decisiones, predicciones) y going to (planes o evidencia presente).',
    ],
    consejo:
      'Busca las expresiones de tiempo: every day, now, yesterday, since, already, tomorrow. Casi siempre indican qué tiempo verbal corresponde.',
    ejercicios: [
      ['She ___ to school every day.', ['walk', 'walks', 'is walk', 'walking'], 'B', 'Present simple, tercera persona singular: walks.'],
      ['Look! It ___.', ['rains', 'is raining', 'rained', 'has rain'], 'B', '"Look!" indica algo que pasa ahora: present continuous.'],
      ['We ___ the museum last Saturday.', ['visit', 'visited', 'have visited', 'are visiting'], 'B', '"Last Saturday" es un pasado terminado: past simple.'],
      ['I ___ never ___ sushi.', ['have / eaten', 'has / ate', 'did / eat', 'am / eating'], 'A', 'Experiencia: present perfect con have + participio.'],
      ['While I ___ dinner, the phone rang.', ['cooked', 'was cooking', 'am cooking', 'have cooked'], 'B', 'Acción en desarrollo interrumpida: past continuous.'],
      ['Look at those clouds! It ___ rain.', ['is going to', 'went to', 'was', 'has'], 'A', 'Predicción basada en evidencia presente: going to.'],
      ['They ___ in Valparaíso since 2019.', ['live', 'lived', 'have lived', 'are live'], 'C', '"Since" indica una acción que continúa: present perfect.'],
      ['Which sentence is in past simple?', ['He plays football.', 'He played football yesterday.', 'He has played football.', 'He will play football.'], 'B', 'Verbo en pasado más "yesterday".'],
    ],
  },
  {
    slug: 'conditionals',
    nombre: 'Conditionals',
    paes: NO_PAES,
    resumen:
      'Las oraciones condicionales expresan que algo ocurre (u ocurriría) si se cumple una condición. Hay cuatro tipos principales.',
    claves: [
      'Zero conditional: If + present, present. Verdades generales. If you heat ice, it melts.',
      'First conditional: If + present, will + verbo. Situaciones reales o probables en el futuro.',
      'Second conditional: If + past, would + verbo. Situaciones hipotéticas o imaginarias. If I were rich…',
      'Third conditional: If + past perfect, would have + participio. Situaciones pasadas que no ocurrieron.',
      'Unless = if not. Unless you study = If you don’t study.',
    ],
    consejo:
      'Mira el verbo de la cláusula con "if": present → zero/first; past → second; had + participio → third.',
    ejercicios: [
      ['If you heat water to 100 °C, it ___.', ['boils', 'would boil', 'boiled', 'will boiled'], 'A', 'Hecho científico: zero conditional.'],
      ['If it rains tomorrow, we ___ at home.', ['stay', 'will stay', 'would stay', 'stayed'], 'B', 'Posibilidad real futura: first conditional.'],
      ['If I ___ rich, I would travel around the world.', ['am', 'were', 'will be', 'have been'], 'B', 'Hipótesis: second conditional con "were".'],
      ['If she had studied, she ___ the exam.', ['would pass', 'will pass', 'would have passed', 'passes'], 'C', 'Pasado irreal: third conditional.'],
      ['"If I won the lottery, I would buy a house" is a:', ['zero conditional', 'first conditional', 'second conditional', 'third conditional'], 'C', 'If + past, would + verbo.'],
      ['"Unless you hurry, you will miss the bus" means:', ['If you hurry, you will miss the bus.', 'If you don’t hurry, you will miss the bus.', 'You missed the bus.', 'You hurry because of the bus.'], 'B', 'Unless equivale a "if not".'],
      ['Which conditional expresses a real possibility in the future?', ['First conditional', 'Second conditional', 'Third conditional', 'None of them'], 'A', 'If + present, will + verbo.'],
      ['If they ___ earlier, they wouldn’t have missed the train.', ['left', 'had left', 'leave', 'would leave'], 'B', 'Third conditional: had + participio.'],
    ],
  },
  {
    slug: 'idioms',
    nombre: 'Idioms',
    paes: NO_PAES,
    resumen:
      'Los idioms son expresiones cuyo significado no se deduce traduciendo palabra por palabra. Son muy comunes en conversaciones, series y canciones.',
    claves: [
      'Piece of cake: algo muy fácil.',
      'Under the weather: sentirse enfermo o decaído.',
      'Hit the books: ponerse a estudiar.',
      'Once in a blue moon: muy rara vez.',
      'Cost an arm and a leg: costar muy caro.',
      'Break the ice: romper el hielo, iniciar una conversación.',
      'Let the cat out of the bag: revelar un secreto.',
      'On cloud nine: estar feliz, en las nubes.',
    ],
    consejo:
      'Aprende los idioms dentro de una oración y en su contexto. Si una frase no tiene sentido literal, probablemente es un idiom.',
    ejercicios: [
      ['"This test was a piece of cake." It means the test was:', ['very easy', 'delicious', 'very long', 'unfair'], 'A', 'Piece of cake = muy fácil.'],
      ['"I’m feeling under the weather." The speaker is:', ['sick', 'very happy', 'cold because of the rain', 'lost'], 'A', 'Under the weather = enfermo o decaído.'],
      ['"I need to hit the books tonight." The speaker needs to:', ['study', 'hit something', 'sell books', 'read comics'], 'A', 'Hit the books = estudiar.'],
      ['"We go to the cinema once in a blue moon." They go:', ['very rarely', 'every night', 'always', 'every month'], 'A', 'Once in a blue moon = muy rara vez.'],
      ['"That phone costs an arm and a leg." The phone is:', ['very expensive', 'free', 'dangerous', 'cheap'], 'A', 'Cost an arm and a leg = muy caro.'],
      ['"She told a joke to break the ice." She wanted to:', ['start a relaxed conversation', 'break something', 'get angry', 'make the room colder'], 'A', 'Break the ice = romper el hielo.'],
      ['"He let the cat out of the bag about the party." He:', ['revealed a secret', 'freed an animal', 'went on a trip', 'bought a pet'], 'A', 'Let the cat out of the bag = revelar un secreto.'],
      ['"After the results, she was on cloud nine." She was:', ['extremely happy', 'confused', 'tired', 'on a plane'], 'A', 'On cloud nine = muy feliz.'],
    ],
  },
]
