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
  #rating;

  constructor({
    id,
    name,
    summary,
    premiered,
    status,
    rating,
    type,
    genres,
    network = null,
    webChannel = null,
    imageUrl,
    weight,
    episodes,
}) 
  {
    // Validación de id (Debe ser un número entero positivo)
    if (typeof id !== 'number' || id <= 0) {
      console.warn("El 'id' introducido no es un valor aceptado, tiene que ser un número entero positivo.");
      this.id = null; 
    }else{
      this.id = id;
    }

    if (typeof name !== 'string') {
      console.warn("El 'name' introducido no es un valor aceptado, tiene que ser una cadena de texto");
      this.name = null; 
    }else{
      this.name = name;
    }

    this.summary = summary;
    this.premiered = premiered;
    this.status = status;

    if (rating === null || (typeof rating === 'number' && rating >= 0 && rating <= 10)) {
      this.#rating = rating;
    }else{
      this.#rating = null;
    }
    
    this.type = type;

    if (!Array.isArray(genres)) {
      console.warn("Aviso: 'genres' debe ser un array. Se inicializa como array vacío.");
      this.genres = [];
    }else{
      this.genres = genres;
    }

    this.network = network;
    this.webChannel = webChannel;
    this.imageUrl = imageUrl;
    this.weight = weight;

  if (!Array.isArray(episodes)) {
    console.warn("Aviso: 'episodes' debe ser un array. Se inicializa como array vacío.");
    this.episodes = [];
  }else{
    this.episodes = episodes;
  }

  }

  // ── Getters y setters ────────────────────────────────────────────────────

  get rating(){
    return this.#rating;
  } 
  
  set rating(newRating){
    const isNumber = (typeof newRating === 'number' 
                      && !Number.isNaN(newRating) 
                      && newRating >= 0 && newRating <= 10);
    if(newRating!==null && isNumber){
      this.#rating = newRating;
    }else{
      console.warn(`valor de rating incorrecto: ${newRating} Se mantiene el valor anterior (${this.#rating}).`);  
    }
  }

  get platform(){
    if(this.network.name){
      return this.network.name;
    }else if(this.webChannel.name){
      return this.webChannel.name;
    }
    return null;
  }
}


/* =============================================================================
   ETAPA 2 — Clase Progress (2 puntos)
   Progreso de visionado de un usuario en una serie concreta.
   ============================================================================= */

class Progress {
  constructor(showId) {
    this.showId = showId;
    this.currentSeason = 0;
    this.currentEpisode = 0;
  }

  /**
   * Marca como último visto el episodio indicado.
   * Devuelve true si se ha actualizado el progreso.
   */
  advance(season, number) {
    if (!Number.isInteger(season) || season <= 0 || !Number.isInteger(number) || number <= 0) {
      console.warn(`Aviso: La temporada y episodio tienen que ser números enteros positivos. 
                  Se mantiene el valor actual ${this.currentSeason}/${this.currentEpisode}`);
      return false;
    }
    this.currentSeason = season;
    this.currentEpisode = number;
    return true;
  }

  /**
   * Vuelve el progreso a 0 / 0 (sin empezar).
   */
  reset() {
    this.currentSeason = 0;
    this.currentEpisode = 0;
  }

  get hasStarted(){
    return this.currentSeason>0 && this.currentEpisode>0;
  }
}


/* =============================================================================
   ETAPA 3 — Clase ShowList (3 puntos)
   Lista de series que sigue el usuario: array de pares { show, progress }.
   ============================================================================= */

class ShowList {
  #entries;
  constructor() {
    this.#entries = [];
  }
// copia del array de pares { show, progress }
  get entries(){
    return this.#entries.map(entry => ({...entry}));
  }  

  // get shows()    → array nuevo solo con los objetos Show
  get shows(){
    return this.#entries.map(entry => (entry.show));
  }

  /**
   * Añade una serie creando su Progress inicial.
   * Devuelve true si se ha añadido.
   */
  addShow(show) {
  // Validación: Debe ser una instancia de la clase Show
    if (!(show instanceof Show)) {
      console.warn("Aviso: Entrada no válida.");
      return false;
    }
    // Validación: No se permiten duplicados por id
    const exists = this.#entries.some(entry => entry.show.id === show.id);
    if (exists) {
      console.warn(`La serie con ID ${show.id} existe, no se añade`);
      return false;
    }
    const progress = new Progress(show.id);
    this.#entries.push({ show, progress });
    return true;
  }

  /**
   * Elimina una serie (y su progreso) por su id.
   * Devuelve true si se ha eliminado.
   */
  removeShow(showId) {
    // entry = true si el id existe
    const entryPos = this.#entries.findIndex(entry => entry.show.id === showId);

    if (entryPos===-1) {
      console.warn(`Aviso: No existe ninguna serie con el ID ${showId}, no se elimina ningun show`);
      return false;
    }
    //elimina el show en la posicion de entryPos
    this.#entries.splice(entryPos, 1);
    return true;
  }

  /**
   * Reinicia el progreso de una serie de la lista.
   * Devuelve true si se ha reiniciado.
   */
  resetProgress(showId) {
    // entry = true si el id existe
    const entry = this.#entries.find(entry => entry.show.id === showId);

    if (!entry) {
      console.warn(`No existe ninguna serie con el ID ${showId}, no se resetea el progreso`);
      return false;
    }
    entry.progress.reset();
    return true;
  }

  /**
   * Muestra por consola nombre, tipo, valoración y progreso de cada serie.
   */
  showList() {
    if(this.#entries.length === 0){
      console.log("Lista Vacia");
    }else{
      this.#entries.forEach(({show, progress}) => {
        const showProgress = progress.hasStarted ? `T${progress.currentSeason}/E${progress.currentEpisode}` : `Sin empezar`;
        console.log(`${show.name}, ${show.type}, ${show.rating}, ${showProgress}`);
        });
    }
  }

  /* ===========================================================================
     ETAPA 4 — Funciones flecha dentro de ShowList (2 puntos)
     =========================================================================== */

  /**
   * Añade varias series a la vez (operador rest).
   * Devuelve el número de series añadidas realmente.
   */
  addMultipleShows = (...shows) => {
    let counter = 0;
    shows.forEach(show => {
      if(this.addShow(show)){
        counter++;
      }
    });
    return counter;
  };

  /**
   * Devuelve los pares { show, progress } con rating dentro del rango
   * [minRating, maxRating].
   */
  getShowsByRatingRange = (minRating, maxRating) => {
    if(typeof minRating!=='number' || typeof maxRating!=='number' 
      || maxRating<minRating || minRating>=0 || maxRating<=10 || minRating<=10 || maxRating>=0){
        console.log('Valores de rating incorrectos, losvalores deben estar entre 0-10 y min no puede ser superior a max');
        return [];
    }
    return this.#entries.filter(({show}) => show.rating!==null && show.rating>=minRating && show.rating<=maxRating);
  };

  /**
   * Devuelve los pares { show, progress } ordenados por weight (de mayor a
   * menor) sin modificar la lista original.
   */
  sortShowsByPopularity = () => {
    return this.#entries.sort((a, b) => (b.show.weight - a.show.weight));
  };

  /* ===========================================================================
     ETAPA 5.2 — markEpisodeWatched (forma parte de la etapa 5)
     =========================================================================== */
 
     // funcion auxiliar de showList para buscar el siguiente episodio de una serie necesaria para MarkEpisodeWatched
  #getNextEpisode(show, progress){
    // 1. Si el progreso está en 0 / 0, el siguiente es el 1/1.
    if (!progress.hasStarted){
      return show.findEpisodeByNumber(show.episodes, 1, 1);
    }

    // Busqueda de episodio siguiente segun progress
    const nextEpisode = findEpisodeByNumber(show.episodes, progress.currentSeason, progress.currentEpisode+1);
    if (nextEpisode){
      return nextEpisode;
    }

    // Si no hay mas episodios en esa temporada primer episodio de la siguiente
    const nextSeasonEpisode = findEpisodeByNumber(show.episodes, progress.currentSeason + 1, 1);
    if(nextSeasonEpisode){
      return nextSeasonEpisode;
    }
    return null;
  }

  /**
   * Avanza el progreso de una serie hasta su siguiente episodio.
   * Devuelve el episodio marcado como visto, o null.
   */
  markEpisodeWatched(showId) {
    //Se comprueba si existe ese ID
    const entry = this.entries.find(show => (show.id === showId)); 
    if(!entry){
      console.log(`No existe el episodio con ID ${showId}`);
      return null;
    }
    const nextEpisode = this.#getNextEpisode(entry.show, entry.progress);
    if(!nextEpisode){
      console.log('lo siento no hay más episodios disponibles');
      return null;
    }
   
    entry.Progress.advance(nextEpisode.season, nextEpisode.number);
    return nextEpisode;
  }
}

/* =============================================================================
   ETAPA 5 — Función recursiva (4 puntos)
   ============================================================================= */

/**
 * 5.1 — Busca recursivamente un episodio por temporada y número.
 * Devuelve el episodio o null si no existe.
 */
const findEpisodeByNumber = (episodes, season, number, index=0) => {
    // Validación
    if (!Array.isArray(episodes) || !Number.isInteger(season) || season<=0 ||
        !Number.isInteger(number) || number<=0) {
        return null;
    }
    if(index>episodes.length){
      console.log('episodio no encontrado');
      return null;
    }
    const current = episodes[index];
    if(current.season===season && current.number===number){
      return current;
    }
    return findEpisodeByNumber(episodes, season, number, index+1);
};


/* =============================================================================
   ETAPA 6 — Uso de reduce (4 puntos)
   ============================================================================= */

/**
 * Devuelve { genre, count } con el género más frecuente del array de series.
 */
const getMostCommonGenre = (shows) => {
    if (!Array.isArray(shows) || shows.length === 0) return null;

  const counts = shows.reduce((acc, show) => {
    for (const genre of show.genres) {
      if(acc[genre]){
        acc[genre]++;
      }else{
        acc[genre] = 1;
      }
    }
    return acc;
  }, {});

  return Object.keys(counts).reduce((best, genre) => {
    return counts[genre] > best.count ? { genre, count: counts[genre] } : best;
  }, { genre: "", count: 0 });
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
  //Validar formato
  if (typeof isoDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    console.warn(`formato de fecha no válido deberia ser aaaa-mm-dd`);
    return null;
  }

  let isoParts =[];
  isoParts = isoDate.split('-');
  const isoYear = Number(parts[0]);
  const isoMonth = Number(parts[1]);
  const isoDay = Number(parts[2]);
  //los meses en new Date van de 0-11 pero la isoDate recibida va de 1-12, restamos 1 a isDate para igualarlo al formato JavaScript
  const targetDate = new Date(Date.UTC(isoYear, isoMonth - 1, isoDay));

  //Comprobamos que la isoDate/today sea una fecha valida
  if(targetDate instanceof Date && !Number.isNaN(targetDate.getTime())){
    console.log(`${isoDate} no es una fecha valida`);
    return null;
  }
  if(today instanceof Date && !Number.isNaN(today.getTime())){
    console.log(`${today} no es una fecha valida`);
    return null;
  }

  const currDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  //Javascript devuelve las restas de fechas en milisegundos con esta constante sabemos los milisegundos en un dia
  const msDay = 1000 * 60 * 60 * 24;
  //devuelve el numero de dias restantes tras restarlas (ms)
  return Math.round((targetDate - currDate) / msDay);
};

/**
 * Devuelve el siguiente episodio pendiente de una serie, o null.
 */
const getNextPendingEpisode = (show, progress) => {
  if(!(show instanceof Show) || !(progress instanceof Progress)){
    console.log('Los parametros introducidos no son instancia de Show y/o de Progress.');
    return null;
  }
  if(show.id !== progress.showId){
    console.log(`Aviso: El progreso (showId: ${progress.showId}) no pertenece a la serie "${show.name}" (id: ${show.id}).`);
    return null;
  }

  return ShowList.prototype.getNextEpisode(show, progress);
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
//console.log (breakingBad);

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

const catalogo = new ShowList();
catalogo.addMultipleShows(breakingBad, theLastOfUs, severance, strangerThings, gameOfThrones, proyectoAurora);
//console.log(catalogo.sortShowsByPopularity());
//console.log(catalogo.showList());
//console.log(catalogo.getShowsByRatingRange(8,10));
//console.log(catalogo.sortShowsByPopularity());
const commonGens = getMostCommonGenre(catalogo.shows);
console.log(commonGens);
