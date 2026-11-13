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

// REPOSITORIO DE GITHUB: https://github.com/JorgeUOC/practica1.git

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
    if(this.network){
      return this.network;
    }else if(this.webChannel){
      return this.webChannel;
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
      || maxRating<minRating || minRating<0 || maxRating>10){
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
      return findEpisodeByNumber(show.episodes, 1, 1);
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
    const entry = this.#entries.find(entry => (entry.show.id === showId)); 
    if(!entry){
      console.log(`No existe el episodio con ID ${showId}`);
      return null;
    }
    const nextEpisode = this.#getNextEpisode(entry.show, entry.progress);
    if(!nextEpisode){
      console.log('lo siento no hay más episodios disponibles');
      return null;
    }
   
    entry.progress.advance(nextEpisode.season, nextEpisode.number);
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
    if(index>=episodes.length){
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
  if(!(show instanceof Show)){
    console.log(`${show} no es una instancia valida`);
    return null;
  }
  const {
    name, 
    type, 
    rating, 
    genres: [first = 'Sin genero'] = [], 
    network, 
    webChannel
  } = show;

  const rate = rating!==null ? rating : "sin valoracion";
  const {name: net} = network || {};
  const {name: web} = webChannel || {};

  let platform;
  if(net){
    platform = net;
  }else if(web){
    platform = web;
  }else{
    platform = "unknown";
  }
  console.log(`Titulo: ${name}\nTipo: ${type}\nValoracion: ${rate}\nGenero: ${first}\nPlataforma: ${platform}`);
  return{
    ...show,
    rating: show.rating,
    following: true
  };
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
  const isoYear = Number(isoParts[0]);
  const isoMonth = Number(isoParts[1]);
  const isoDay = Number(isoParts[2]);
  //los meses en new Date van de 0-11 pero la isoDate recibida va de 1-12, restamos 1 a isDate para igualarlo al formato JavaScript
  const targetDate = new Date(Date.UTC(isoYear, isoMonth - 1, isoDay));

  //Comprobamos que la isoDate/today sea una fecha valida
  if(targetDate instanceof Date && Number.isNaN(targetDate.getTime())){
    console.log(`${targetDate} no es una fecha valida`);
    return null;
  }
  if(!(today instanceof Date) || Number.isNaN(today.getTime())){
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
  
  if (!progress.hasStarted) {
        return findEpisodeByNumber(show.episodes, 1, 1);
    }

  const nextEpisode = findEpisodeByNumber(show.episodes, progress.currentSeason, progress.currentEpisode + 1);
  if (nextEpisode){ 
    return nextEpisode;
  }
  const nextSeasonEpisode = findEpisodeByNumber(show.episodes, progress.currentSeason + 1, 1);
  if (nextSeasonEpisode){ 
    return nextSeasonEpisode;
  }
  return null;
};

/* =============================================================================
   ETAPA 9 — Función avanzada con múltiples operadores (5 puntos)
   ============================================================================= */

/**
 * Devuelve { platform, count, shows, averageRating } para una cadena
 * o plataforma concreta.
 */
const getShowsByPlatform = (shows, platformName) => {
  //validacion de parametros de entrada
  if(!Array.isArray(shows)){
    console.warn("Aviso: El parámetro 'shows' debe ser un array.");
    return null;
  }
  if(typeof platformName !== "string" || platformName === ""){
    console.warn("Aviso: El nombre de la plataforma debe ser una cadena de texto no vacía.");
    return null;
  }
  const matchingShows = shows.filter((show) => {
    return show.network?.name === platformName || show.webChannel?.name === platformName;
  });

  const rated = matchingShows.filter((show) => show.rating!==null);
  const average = rated.length > 0 ? rated.reduce((acc, show) => acc + show.rating, 0) / rated.length : null;

  return {
    platform: platformName,
    count: matchingShows.length,
    shows: matchingShows.map((show) => show.name),
    averageRating: average,
  };
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

const catalogo = new ShowList();
catalogo.addMultipleShows(breakingBad, theLastOfUs, severance, strangerThings, gameOfThrones, proyectoAurora);


/* =============================================================================
   PRUEBAS
   Añadid aquí las llamadas necesarias para probar todas las etapas y ver los
   resultados por consola. Incluid también pruebas con datos no válidos y con
   los casos límite que indica el enunciado.
   ============================================================================= */



// ------------------------------------------
// ETAPA 1: Pruebas de la clase Show
// ------------------------------------------
console.log("--- ETAPA 1: Clase Show ---");

console.log("1.1 Propiedades y plataforma (network vs webChannel):");
console.log(`- ${breakingBad.name} (ID: ${breakingBad.id}) | Plataforma: ${breakingBad.platform} | Rating: ${breakingBad.rating}`);
console.log(`- ${strangerThings.name} (ID: ${strangerThings.id}) | Plataforma: ${strangerThings.platform} | Rating: ${strangerThings.rating}`);
console.log(`- ${severance.name} (ID: ${severance.id}) | Plataforma: ${severance.platform} | Rating: ${severance.rating}`);
console.log(`- ${proyectoAurora.name} (Caso límite) | Plataforma: ${proyectoAurora.platform} | Rating: ${proyectoAurora.rating} | Géneros: [${proyectoAurora.genres}]`);

console.log("\n1.2 Probando validación en constructor (deben saltar warnings):");
const showInvalido = new Show({
  id: -10,
  name: 999,
  summary: "Test",
  premiered: "2020-01-01",
  status: "Running",
  rating: 15,
  type: "Scripted",
  genres: "No es un array",
  episodes: null
});
console.log("Resultado show inválido:", {
  id: showInvalido.id,
  name: showInvalido.name,
  rating: showInvalido.rating,
  genres: showInvalido.genres,
  episodes: showInvalido.episodes
});

console.log("\n1.3 Probando setter de rating en Breaking Bad y Proyecto Aurora:");
proyectoAurora.rating = 8.1; // Estaba en null, ahora válido
console.log("Nuevo rating Proyecto Aurora (esperado 8.1):", proyectoAurora.rating);
proyectoAurora.rating = 12;  // Inválido -> warning y mantiene 8.1
proyectoAurora.rating = "alto"; // Inválido -> warning y mantiene 8.1
console.log("Rating tras fallos (esperado 8.1):", proyectoAurora.rating);
// Lo devolvemos a null para mantener el caso límite original en las siguientes pruebas
proyectoAurora.rating = null;


// ------------------------------------------
// ETAPA 2: Pruebas de la clase Progress
// ------------------------------------------
console.log("\n--- ETAPA 2: Clase Progress ---");
const progresoGot = new Progress(gameOfThrones.id);
console.log("Estado inicial (ID 82):", progresoGot.currentSeason, progresoGot.currentEpisode, "| Empezado:", progresoGot.hasStarted);

console.log("Avanzar a T1E2 (válido):", progresoGot.advance(1, 2)); // true
console.log("Estado actual:", `T${progresoGot.currentSeason}E${progresoGot.currentEpisode}`, "| Empezado:", progresoGot.hasStarted);

console.log("Avanzar a T0E1 (inválido):", progresoGot.advance(0, 1)); // false + warning
console.log("Avanzar a T2E-3 (inválido):", progresoGot.advance(2, -3)); // false + warning
console.log("Estado tras intentos fallidos (esperado T1E2):", `T${progresoGot.currentSeason}E${progresoGot.currentEpisode}`);

progresoGot.reset();
console.log("Tras reset (esperado T0E0 | false):", `T${progresoGot.currentSeason}E${progresoGot.currentEpisode}`, "| Empezado:", progresoGot.hasStarted);


// ------------------------------------------
// ETAPA 3: Pruebas de la clase ShowList
// ------------------------------------------
console.log("\n--- ETAPA 3: Clase ShowList ---");
const miLista = new ShowList();

console.log("3.1 Lista vacía:");
miLista.showList();

console.log("\n3.2 Añadir series individualmente y validaciones:");
console.log("Añadir Breaking Bad:", miLista.addShow(breakingBad)); // true
console.log("Añadir Breaking Bad otra vez (duplicado):", miLista.addShow(breakingBad)); // false + warning
console.log("Añadir objeto que no es Show:", miLista.addShow({ id: 1, name: "Fake" })); // false + warning

console.log("\n3.3 Eliminar serie:");
console.log("Eliminar ID inexistente (99999):", miLista.removeShow(99999)); // false + warning
console.log("Eliminar Breaking Bad (ID 169):", miLista.removeShow(169)); // true
console.log("Shows restantes (esperado 0):", miLista.shows.length);

// ------------------------------------------
// ETAPA 4: Funciones flecha en ShowList
// ------------------------------------------
console.log("\n--- ETAPA 4: Funciones flecha en ShowList ---");

const totalAñadidas = miLista.addMultipleShows(
  breakingBad,
  gameOfThrones,
  strangerThings,
  theLastOfUs,
  severance,
  proyectoAurora,
  gameOfThrones // Duplicado, no debería contarse
);
console.log("4.1 Series añadidas con addMultipleShows (esperado 6):", totalAñadidas);

console.log("\n4.2 Filtrar por rango de rating (8.0 a 9.5) - excluye null (Proyecto Aurora) y < 8.0:");
const mejoresSeries = miLista.getShowsByRatingRange(8.3, 9.5);
console.log("Resultados (esperado BB 9.2, GoT 8.9, ST 8.4):", mejoresSeries.map(e => `${e.show.name} (${e.show.rating})`));
//console.log(mejoresSeries);
//console.log(catalogo.getShowsByRatingRange(8,10));

console.log("Probando rango inválido (9.0 a 7.0):");
miLista.getShowsByRatingRange(9.0, 7.0); // Mensaje de error

console.log("\n4.3 Ordenar por popularidad (weight descendente) sin mutar original:");
const porPopularidad = miLista.sortShowsByPopularity();
console.log("Ordenadas (99, 99, 98, 97, 96, 40):", porPopularidad.map(e => `${e.show.name} (${e.show.weight})`));

// ------------------------------------------
// ETAPA 5: Recursividad y markEpisodeWatched
// ------------------------------------------
console.log("\n--- ETAPA 5: Recursividad y markEpisodeWatched ---");

console.log("5.1 Búsqueda recursiva (findEpisodeByNumber):");
console.log("Buscar T2E1 en Breaking Bad:", findEpisodeByNumber(breakingBad.episodes, 2, 1)?.name); // Seven Thirty-Seven
console.log("Buscar T3E1 en The Last of Us:", findEpisodeByNumber(theLastOfUs.episodes, 3, 1)?.name); // TBA
console.log("Buscar T5E1 en Severance (no existe):", findEpisodeByNumber(severance.episodes, 5, 1)); // null

console.log("\n5.2 Avanzar episodios automáticamente en Stranger Things (ID 2993):");
console.log("1º visto (T1E1):", miLista.markEpisodeWatched(2993)?.name);
console.log("2º visto (T1E2):", miLista.markEpisodeWatched(2993)?.name);
console.log("3º visto - salto a T2E1:", miLista.markEpisodeWatched(2993)?.name);
console.log("4º visto - sin más episodios (esperado null):", miLista.markEpisodeWatched(2993));

console.log("\n5.3 Avanzar un episodio en Severance (ID 44933) y luego resetear:");
console.log("1º visto en Severance:", miLista.markEpisodeWatched(44933)?.name);
console.log("Reseteando progreso de Severance:", miLista.resetProgress(44933)); // true

console.log("\n5.4 Estado completo de la lista con showList():");
miLista.showList();

// ------------------------------------------
// ETAPA 6: Uso de reduce (getMostCommonGenre)
// ------------------------------------------
console.log("\n--- ETAPA 6: getMostCommonGenre ---");
// Drama aparece en las 5 series reales; Proyecto Aurora tiene genres: []
console.log("Género más común (esperado { genre: 'Drama', count: 5 }):", getMostCommonGenre(miLista.shows));
console.log("Solo con Proyecto Aurora (sin géneros):", getMostCommonGenre([proyectoAurora]));

// ------------------------------------------
// ETAPA 7: Destructuring y spread (getShowInfo)
// ------------------------------------------
console.log("\n--- ETAPA 7: getShowInfo ---");

console.log("7.1 Serie con network y rating (Breaking Bad):");
const infoBB = getShowInfo(breakingBad);
console.log("Objeto devuelto (debe tener following: true y rating 9.2):", infoBB);
console.log("¿El objeto original se ha modificado? (esperado undefined):", breakingBad.following);

console.log("\n7.2 Serie con webChannel (Stranger Things):");
const infoST = getShowInfo(strangerThings);
console.log("Objeto devuelto:", infoST);

console.log("\n7.3 Serie caso límite (Proyecto Aurora: sin rating, sin géneros, sin plataforma):");
const infoAurora = getShowInfo(proyectoAurora);
console.log("Objeto devuelto:", infoAurora);

console.log("\n7.4 Entrada inválida (no es instancia de Show):");
//console.log("Con objeto plano:", getShowInfo({ name: "Serie Falsa" })); // esperado null
//console.log("Con null:", getShowInfo(null)); // esperado null

// ------------------------------------------
// ETAPA 8: Manejo de fechas (daysUntil y getNextPendingEpisode)
// ------------------------------------------
console.log("\n--- ETAPA 8: Manejo de fechas ---");

// 8.1 Pruebas de daysUntil usando TODAY = new Date(2026, 10, 13) -> 13 nov 2026
console.log("8.1 Pruebas de daysUntil (referencia TODAY: 2026-11-13):");

// Fecha futura: estreno de Proyecto Aurora (2026-11-20) -> faltan 7 días
console.log("Estreno Proyecto Aurora (2026-11-20, esperado 7):", daysUntil(proyectoAurora.premiered, TODAY));

// Mismo día: 2026-11-13 -> faltan 0 días
console.log("Mismo día (2026-11-13, esperado 0):", daysUntil("2026-11-13", TODAY));

// Fecha pasada: estreno de Breaking Bad (2008-01-20) -> número negativo
console.log("Estreno Breaking Bad (2008-01-20, esperado < 0):", daysUntil(breakingBad.premiered, TODAY));

// Casos inválidos en daysUntil
console.log("Formato incorrecto ('13/11/2026', esperado null):", daysUntil("13/11/2026", TODAY));
console.log("Tipo incorrecto (null, esperado null):", daysUntil(null, TODAY));
console.log("Fecha today inválida (esperado null):", daysUntil("2026-11-20", "no-es-fecha"));

// 8.2 Pruebas de getNextPendingEpisode
console.log("\n8.2 Pruebas de getNextPendingEpisode:");

const progSeverance = new Progress(severance.id); // ID 44933, empieza en 0x0
console.log("Severance sin empezar (esperado T1E1 - Good News About Hell):", getNextPendingEpisode(severance, progSeverance));

progSeverance.advance(1, 2); // Marcamos visto hasta T1E2
console.log("Severance tras ver T1E2 (esperado T2E1 - Hello, Ms. Cobel):", getNextPendingEpisode(severance, progSeverance));

progSeverance.advance(2, 1); // Marcamos visto el último episodio disponible (T2E1)
console.log("Severance al día, sin más episodios (esperado null):", getNextPendingEpisode(severance, progSeverance));

// Casos de error en getNextPendingEpisode
console.log("\n> Probando errores en getNextPendingEpisode:");
const progEquivocado = new Progress(breakingBad.id); // ID 169 != 44933
console.log("Progreso de otra serie (esperado null):", getNextPendingEpisode(severance, progEquivocado));
console.log("Parámetros inválidos (esperado null):", getNextPendingEpisode("Severance", progSeverance));

/* =============================================================================
   PRUEBAS ETAPA 9 — getShowsByPlatform
   ============================================================================= */
console.log("\n--- ETAPA 9: getShowsByPlatform ---");

console.log("Series en HBO:", getShowsByPlatform(catalogo.shows, 'HBO'));
// { platform: 'HBO', count: 2, shows: ['The Last of Us', 'Game of Thrones'], averageRating: 8.4 }

console.log("Series en Netflix:", getShowsByPlatform(catalogo.shows, 'Netflix'));
// { platform: 'Netflix', count: 1, shows: ['Stranger Things'], averageRating: 8.4 }

console.log("Plataforma sin series ('Disney+'):", getShowsByPlatform(catalogo.shows, 'Disney+'));

console.log(catalogo.sortShowsByPopularity());
console.log(catalogo.showList());

//console.log(catalogo.sortShowsByPopularity());
//const commonGens = getMostCommonGenre(catalogo.shows);
//console.log(commonGens);
