/**
 * =============================================================================
 * PROGRAMACIÓN WEB - PRÁCTICA 1
 * Seguimiento de series de TV con JavaScript (datos de TVmaze)
 * =============================================================================
 *
 * Este archivo debe implementar las 9 etapas de la práctica utilizando:
 *   - Clases con campos privados, getters y setters
 *   - Métodos de clase y funciones flecha
 *   - Recursividad, reduce, map, filter
 *   - Destructuring y spread operator
 *   - Manejo de fechas con el objeto Date
 *
 * Convenciones a seguir:
 *   - Se usa `const` para valores que no cambian y `let` para los que sí.
 *   - Las funciones anónimas se escriben como arrow functions.
 *   - Los nombres siguen camelCase (variables/funciones) y PascalCase (clases).
 *   - Todos los identificadores se escriben en inglés.
 *   - Las comparaciones son siempre estrictas (=== / !==).
 *   - Se usan métodos de Array en lugar de bucles for/while
 *     (excepto en la función recursiva de la etapa 5.1).
 *   - Los datos no válidos se gestionan siempre igual: aviso con console.warn,
 *     sin modificar ningún dato, y devolviendo false / null / [].
 *   - Los comentarios siguen las 9 reglas de Ellen Spertus:
 *     explicar el "por qué", no el "qué" evidente en el código.
 *
 * Las firmas de este archivo (nombres y parámetros) son las que pide el
 * enunciado: no las cambiéis. Podéis añadir las funciones auxiliares que
 * necesitéis.
 * =============================================================================
 */

/* =============================================================================
   ETAPA 1 — Clase Show (3 puntos)
   Representa una serie con sus datos de catálogo (los que vendrán de la API).
   ============================================================================= */

class Show {
  // Recordad: el valor de rating debe guardarse en un campo con otro nombre
  // (por ejemplo, un campo privado #rating).

  constructor({
    id,
    name,
    summary,
    premiered,
    status,
    rating,
    type,
    genres,
    network,
    webChannel,
    imageUrl,
    weight,
    episodes,
  }) {
    // ...
  }

  // ── Getters y setters ────────────────────────────────────────────────────

  // get rating() / set rating(newRating)

  // get platform()
}


/* =============================================================================
   ETAPA 2 — Clase Progress (2 puntos)
   Progreso de visionado de un usuario en una serie concreta.
   ============================================================================= */

class Progress {
  constructor(showId) {
    // ...
  }

  /**
   * Marca como último visto el episodio indicado.
   * Devuelve true si se ha actualizado el progreso.
   */
  advance(season, number) {
    // ...
  }

  /**
   * Vuelve el progreso a 0 / 0 (sin empezar).
   */
  reset() {
    // ...
  }

  // get hasStarted()
}


/* =============================================================================
   ETAPA 3 — Clase ShowList (3 puntos)
   Lista de series que sigue el usuario: array de pares { show, progress }.
   ============================================================================= */

class ShowList {
  constructor() {
    // ...
  }

  // get entries()  → copia del array de pares { show, progress }

  // get shows()    → array nuevo solo con los objetos Show

  /**
   * Añade una serie creando su Progress inicial.
   * Devuelve true si se ha añadido.
   */
  addShow(show) {
    // ...
  }

  /**
   * Elimina una serie (y su progreso) por su id.
   * Devuelve true si se ha eliminado.
   */
  removeShow(showId) {
    // ...
  }

  /**
   * Reinicia el progreso de una serie de la lista.
   * Devuelve true si se ha reiniciado.
   */
  resetProgress(showId) {
    // ...
  }

  /**
   * Muestra por consola nombre, tipo, valoración y progreso de cada serie.
   */
  showList() {
    // ...
  }

  /* ===========================================================================
     ETAPA 4 — Funciones flecha dentro de ShowList (2 puntos)
     =========================================================================== */

  /**
   * Añade varias series a la vez (operador rest).
   * Devuelve el número de series añadidas realmente.
   */
  addMultipleShows = (...shows) => {
    // ...
  };

  /**
   * Devuelve los pares { show, progress } con rating dentro del rango
   * [minRating, maxRating].
   */
  getShowsByRatingRange = (minRating, maxRating) => {
    // ...
  };

  /**
   * Devuelve los pares { show, progress } ordenados por weight (de mayor a
   * menor) sin modificar la lista original.
   */
  sortShowsByPopularity = () => {
    // ...
  };

  /* ===========================================================================
     ETAPA 5.2 — markEpisodeWatched (forma parte de la etapa 5)
     =========================================================================== */

  /**
   * Avanza el progreso de una serie hasta su siguiente episodio.
   * Devuelve el episodio marcado como visto, o null.
   */
  markEpisodeWatched(showId) {
    // ...
  }
}


/* =============================================================================
   ETAPA 5 — Función recursiva (4 puntos)
   ============================================================================= */

/**
 * 5.1 — Busca recursivamente un episodio por temporada y número.
 * Devuelve el episodio o null si no existe.
 */
const findEpisodeByNumber = (episodes, season, number) => {
  // ...
};


/* =============================================================================
   ETAPA 6 — Uso de reduce (4 puntos)
   ============================================================================= */

/**
 * Devuelve { genre, count } con el género más frecuente del array de series.
 */
const getMostCommonGenre = (shows) => {
  // ...
};


/* =============================================================================
   ETAPA 7 — Destructuring y spread (3 puntos)
   ============================================================================= */

/**
 * Muestra la información principal de una serie y devuelve una copia
 * con el campo following: true.
 */
const getShowInfo = (show) => {
  // ...
};


/* =============================================================================
   ETAPA 8 — Manejo de fechas (4 puntos)
   ============================================================================= */

/**
 * Días naturales que faltan desde today hasta isoDate (aaaa-mm-dd).
 */
const daysUntil = (isoDate, today = new Date()) => {
  // ...
};

/**
 * Devuelve el siguiente episodio pendiente de una serie, o null.
 */
const getNextPendingEpisode = (show, progress) => {
  // ...
};

/* =============================================================================
   ETAPA 9 — Función avanzada con múltiples operadores (5 puntos)
   ============================================================================= */

/**
 * Devuelve { platform, count, shows, averageRating } para una cadena
 * o plataforma concreta.
 */
const getShowsByPlatform = (shows, platformName) => {
  // ...
};


/* =============================================================================
   DATOS DE PRUEBA
   Datos reales de la API de TVmaze (consultados en septiembre de 2026),
   simplificados para la práctica: cada serie incluye solo algunos episodios
   por temporada y el resumen está en castellano y en texto plano.
   Hay tres excepciones, pensadas para poder probar todos los casos:
     - weight: en la API vale 100 en todas estas series. Aquí usamos valores
       distintos para que ordenar por popularidad dé un resultado visible.
     - El episodio T3E1 de The Last of Us, anunciado pero sin fecha.
     - La serie "Proyecto Aurora", sin valoración, sin géneros, sin cadena
       ni plataforma y con estrenos futuros.
   ============================================================================= */

const breakingBad = new Show({
  id: 169,
  name: 'Breaking Bad',
  summary: 'Un profesor de química con cáncer terminal empieza a fabricar metanfetamina para asegurar el futuro de su familia.',
  premiered: '2008-01-20',
  status: 'Ended',
  rating: 9.2,
  type: 'Scripted',
  genres: ['Drama', 'Crime', 'Thriller'],
  network: { name: 'AMC', country: { name: 'United States', code: 'US', timezone: 'America/New_York' } },
  webChannel: null,
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg',
  weight: 98,
  episodes: [
    { season: 1, number: 1, name: 'Pilot', airdate: '2008-01-20', summary: '', runtime: 60 },
    { season: 1, number: 2, name: "Cat's in the Bag...", airdate: '2008-01-27', summary: '', runtime: 60 },
    { season: 1, number: 3, name: "...and the Bag's in the River", airdate: '2008-02-10', summary: '', runtime: 60 },
    { season: 2, number: 1, name: 'Seven Thirty-Seven', airdate: '2009-03-08', summary: '', runtime: 60 },
    { season: 2, number: 2, name: 'Grilled', airdate: '2009-03-15', summary: '', runtime: 60 },
  ],
});

const gameOfThrones = new Show({
  id: 82,
  name: 'Game of Thrones',
  summary: 'Varias familias nobles luchan por el control del Trono de Hierro de los Siete Reinos.',
  premiered: '2011-04-17',
  status: 'Ended',
  rating: 8.9,
  type: 'Scripted',
  genres: ['Drama', 'Adventure', 'Fantasy'],
  network: { name: 'HBO', country: { name: 'United States', code: 'US', timezone: 'America/New_York' } },
  webChannel: null,
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg',
  weight: 99,
  episodes: [
    { season: 1, number: 1, name: 'Winter is Coming', airdate: '2011-04-17', summary: '', runtime: 60 },
    { season: 1, number: 2, name: 'The Kingsroad', airdate: '2011-04-24', summary: '', runtime: 60 },
    { season: 2, number: 1, name: 'The North Remembers', airdate: '2012-04-01', summary: '', runtime: 60 },
  ],
});

const strangerThings = new Show({
  id: 2993,
  name: 'Stranger Things',
  summary: 'Tras la desaparición de un niño, un pueblo descubre experimentos secretos y fuerzas sobrenaturales.',
  premiered: '2016-07-15',
  status: 'Ended',
  rating: 8.4,
  type: 'Scripted',
  genres: ['Drama', 'Horror', 'Science-Fiction'],
  network: null,
  webChannel: { name: 'Netflix', country: null },
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/595/1489169.jpg',
  weight: 99,
  episodes: [
    { season: 1, number: 1, name: 'Chapter One: The Vanishing of Will Byers', airdate: '2016-07-15', summary: '', runtime: 49 },
    { season: 1, number: 2, name: 'Chapter Two: The Weirdo on Maple Street', airdate: '2016-07-15', summary: '', runtime: 56 },
    { season: 2, number: 1, name: 'Chapter One: MADMAX', airdate: '2017-10-27', summary: '', runtime: 48 },
  ],
});

const theLastOfUs = new Show({
  id: 46562,
  name: 'The Last of Us',
  summary: 'Veinte años después de una pandemia, un superviviente escolta a una adolescente a través de un país devastado.',
  premiered: '2023-01-15',
  status: 'Running',
  rating: 7.9,
  type: 'Scripted',
  genres: ['Drama', 'Action', 'Horror'],
  network: { name: 'HBO', country: { name: 'United States', code: 'US', timezone: 'America/New_York' } },
  webChannel: null,
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/563/1409008.jpg',
  weight: 97,
  episodes: [
    { season: 1, number: 1, name: 'When You\'re Lost in the Darkness', airdate: '2023-01-15', summary: '', runtime: 85 },
    { season: 1, number: 2, name: 'Infected', airdate: '2023-01-22', summary: '', runtime: 56 },
    { season: 2, number: 1, name: 'Future Days', airdate: '2025-04-13', summary: '', runtime: 62 },
    // Ficticio: episodio anunciado pero sin fecha de emisión conocida.
    // (En la API, un episodio sin fecha llega con airdate ""; aquí usamos null.)
    { season: 3, number: 1, name: 'TBA', airdate: null, summary: '', runtime: null },
  ],
});

const severance = new Show({
  id: 44933,
  name: 'Severance',
  summary: 'Los empleados de una empresa se someten a un procedimiento que separa sus recuerdos del trabajo y de su vida personal.',
  premiered: '2022-02-18',
  status: 'Running',
  rating: 7.7,
  type: 'Scripted',
  genres: ['Drama', 'Science-Fiction', 'Mystery'],
  network: null,
  webChannel: { name: 'Apple TV', country: null },
  imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/548/1371406.jpg',
  weight: 96,
  episodes: [
    { season: 1, number: 1, name: 'Good News About Hell', airdate: '2022-02-18', summary: '', runtime: 57 },
    { season: 1, number: 2, name: 'Half Loop', airdate: '2022-02-18', summary: '', runtime: 53 },
    { season: 2, number: 1, name: 'Hello, Ms. Cobel', airdate: '2025-01-17', summary: '', runtime: 48 },
  ],
});

// Serie ficticia pensada para los casos límite: sin valoración, sin géneros,
// sin cadena ni plataforma y con episodios que se emitirán en el futuro.
const proyectoAurora = new Show({
  id: 90001,
  name: 'Proyecto Aurora',
  summary: 'Serie ficticia para las pruebas de la práctica.',
  premiered: '2026-11-20',
  status: 'To Be Determined',
  rating: null,
  type: 'Documentary',
  genres: [],
  network: null,
  webChannel: null,
  imageUrl: '',
  weight: 40,
  episodes: [
    { season: 1, number: 1, name: 'Episodio 1', airdate: '2026-11-20', summary: '', runtime: 45 },
    { season: 1, number: 2, name: 'Episodio 2', airdate: '2026-11-27', summary: '', runtime: 45 },
  ],
});

// Fecha fija para que los resultados de las pruebas de fechas no dependan del
// día en que se ejecuten: 13 de noviembre de 2026 en hora local.
const TODAY = new Date(2026, 10, 13);


/* =============================================================================
   PRUEBAS
   Añadid aquí las llamadas necesarias para probar todas las etapas y ver los
   resultados por consola. Incluid también pruebas con datos no válidos y con
   los casos límite que indica el enunciado.
   ============================================================================= */

// ...
