// ============================================================
// FILE DI SCRIPT PER LA GESTIONE DELLA PAGINA 
// ============================================================

/**
 * creo una variabile globale dove verranno memorizzate le traduzioni caricate da file JSON
 * utilizzata per aggiornare dinamicamente i testi sulla pagina
 */
let translations = {};

// ============================================================
// Metodo per il caricamento delle traduzioni
// ============================================================

/**
 * Carica un file JSON di traduzioni dalla cartella assets/i18n in base alla lingua richiesta
 * @param {string} lang - codice della lingua
 * @returns {Promise<boolean>} - Restituisce true se il file è stato caricato correttamente, false in caso contrario
 */
async function loadTranslations(lang) {
  try {
    // eseguo una richiesta HTTP via fetch per caricare il file di traduzione per la lingua specificata
    const response = await fetch(`assets/i18n/${lang}.json`);

    // verifica se la risposta HTTP è andata a buon fine
    if (!response.ok) {
      // stampo in console un messaggio di tipo error utile per il debug
      console.error(`Errore: Impossibile caricare il file di traduzione per "${lang}" da assets/i18n/${lang}.json. Controlla il percorso del file.`);
      // sollevo un'eccezione casusata dall'impossibilitò di effettuare il parsing del file JSON
      throw new Error(`Could not load translation file for ${lang}`);
    }

    // eseguo il parsing del contenuto JSON ricevuto e lo salvo nella variabile globale
    translations = await response.json();

    // il file è stato caricato e analizzato correttamente
    // restituisco true
    return true;

  } catch (error) {
    // stampo in console un messaggio di tipo error utile per il debug
    console.error("Errore nel caricamento delle traduzioni:", error);
    // restituisco false
    return false;
  }
}

// ============================================================
// Metodo per l' applicazione tdelle raduzioni alla pagina
// ============================================================

/**
 * Applica le traduzioni caricate agli elementi HTML che le richiedono
 * Aggiorna anche la bandiera e il testo mostrato nel menu a tendina della lingua
 * @param {string} lang - codice della lingua selezionata
 */
function applyTranslations(lang) {
  // stampa in console un messaggio utile per il debug
  console.log(`Tentativo di applicare le traduzioni per la lingua: ${lang}`);

  // seleziono tutti gli elementi HTML che hanno l'attributo personalizzato data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    // escludo l'elemento relativo alle lingue mostrate per evitare una sovrascrittura
    if (element.id !== 'currentLangText') {

      // ottengo la chiave di traduzione associata all'elemento utilizzando l'attributo data-i18n
      const key = element.getAttribute('data-i18n');

      // se esiste una traduzione per questa chiave aggiorno il contenuto dell’elemento
      if (translations[key]) {
        element.textContent = translations[key];

        // se l’elemento è <title> aggiorno il titolo della pagina
        if (element.tagName === 'TITLE') {
          document.title = translations[key];
        }
      }
    }
  });

  /**
   * sezione per la gestione del menù a tendina della lingua
   */

  // seleziono la navbar dropdown per la lingua
  const navbarDropdown = document.getElementById('navbarDropdown');

  // se la navbar dropdown esiste
  if (navbarDropdown) {

    // seleziono l'immagine della bandiera della lingua corrente
    let currentLangFlag = navbarDropdown.querySelector('#currentLangFlag');

    // se l'immagine non esiste la crea e la inserisce
    if (!currentLangFlag) {
      // crea l'immagine
      currentLangFlag = document.createElement('img');
      // imposto l'id dell'elemento
      currentLangFlag.id = 'currentLangFlag';
      // aggiunge la classe 'me-2' per il margine destro
      currentLangFlag.classList.add('me-2');
      // imposto la larghezza dell'immagine a 20px
      currentLangFlag.style.width = '20px';
      // imposto l'altezza dell'immagine automatica
      currentLangFlag.style.height = 'auto';
      // inserisce l'immagine come primo figlio
      navbarDropdown.prepend(currentLangFlag);
      // stampo un messaggio in console utile per il debug
      console.log("currentLangFlag (img) ricreato e aggiunto a #navbarDropdown.");
    }

    // costruisco il percorso dell'immagine della bandiera per la lingua corrente
    const newSrc = `assets/imgs/flags/${lang}_flag.png`;
    // stampo un messaggio in console utile per il debug
    console.log(`Aggiornamento SRC della bandiera a: "${newSrc}"`);
    // imposto il percorso dell'immagine
    currentLangFlag.src = newSrc;
    // imposto l'alt dell'immagine per l'accessibilità
    currentLangFlag.alt = `Bandiera ${lang.toUpperCase()}`;

    // gestisco l'evento di errore per segnalare con un messaggio di tipo error in console 
    // se l'immagine viene caricata correttamente o meno
    currentLangFlag.onerror = () => {
      console.error(`ERRORE: Impossibile caricare l'immagine della bandiera da: "${newSrc}".`);
    };

    // gestisco l'evento di caricamento per segnalare con un messaggio in console
    // quando l'immagine viene caricata correttamente
    currentLangFlag.onload = () => {
      console.log(`Immagine della bandiera caricata con successo da: "${newSrc}"`);
    };

  } else {
    // la navbar non esiste, stampo un messaggio di tipo warning in console
    console.warn("Elemento con ID 'navbarDropdown' non trovato. Assicurati che esista nel DOM.");
  }

  // imposta il codice lingua sull'elemento HTML principale per migliorare l’accessibilità e l’indicizzazione
  document.documentElement.lang = lang;

  // salva la lingua scelta in localStorage per mantenerla anche dopo il refresh della pagina
  localStorage.setItem('selectedLanguage', lang);
  // stampo un messaggio in console per il debug sul salvataggio della lingua
  console.log(`Lingua impostata a: "${lang}" e salvata nel localStorage.`);
}

// ============================================================
// Metodo per l'inizializzazione della lingua
// ============================================================

/**
 * Inizializza la lingua al caricamento della pagina
 * Verifica se c'è una lingua salvata in localStorage, se non presente, usa 'it' come default.
 */
async function initializeLanguage() {
  // stampo un messaggio in console utile per il debug 
  console.log("Inizializzazione della lingua...");

  // recupero la lingua salvata in localStorage
  const storedLang = localStorage.getItem('selectedLanguage');
  // se non salvata imposta italiano come predefinito
  const defaultLang = storedLang || 'it';
  // stampo un messaggio in console utile per il debug
  console.log(`Lingua predefinita/salvata: "${defaultLang}"`);

  // carico le traduzioni
  const loaded = await loadTranslations(defaultLang);

  // se le traduzioni sono state caricate correttamente
  if (loaded) {
    // stampo un messaggio in console utile per il debug
    console.log(`Traduzioni caricate per: "${defaultLang}". Applicazione traduzioni...`);
    // applica le traduzioni
    applyTranslations(defaultLang);
  } else {
    // se le traduzioni non sono state caricate forza l'italiano
    // stampo un messaggio ti tipo warning in console utile per il debug
    console.warn(`Impossibile caricare le traduzioni per "${defaultLang}". Tentativo di fallback su 'it'.`);
    // carico le traduzioni in italiano
    await loadTranslations('it');
    // applico le traduzioni in italiano
    applyTranslations('it');
  }
}

// ============================================================
// Metodo per l'attivazione dei link navbar in base allo scroll
// ============================================================

/**
 * Evidenzia dinamicamente il link nella navbar relativo alla sezione attualmente visibile nello scroll
 * tenendo conto dell’altezza della navbar per calcolare l’offset corretto
 */
function updateNavbarActiveLink() {
  // seleziono tutte le sezioni della pagina che hanno un id (sono target per i link)
  const sections = document.querySelectorAll('section[id]');
  // seleziono tutti i link della navbar
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  // creo una variabile locale che conterrà l'id della sezione che risulta attualmente attiva a seconda dello scroll
  let currentActiveSectionId = '';

  // seleziono la navbar
  const navbar = document.querySelector('.navbar');
  // se la navbar esiste, ne ottiene l'altezza, altrimenti usa 0
  const navbarHeight = navbar ? navbar.offsetHeight : 0;

  // ciclo tutte le sezioni per determinare quale è attualmente visibile nella finestra
  sections.forEach(section => {
    // calcolo la distanza dall'alto della pagina all'inizio della sezione,
    // togliendo l'altezza della navbar e un margine extra per ottenere l'attivazione anticipata
    const sectionTop = section.offsetTop - navbarHeight - 20;

    // calcolo il fondo della sezione, sommando la sua altezza alla sua posizione iniziale
    const sectionBottom = sectionTop + section.offsetHeight;

    // calcolo l'altezza totale della pagina
    const pageHeight = document.documentElement.scrollHeight;
    // calcola l'altezza visibile della finestra
    const viewportHeight = window.innerHeight;

    // se l'utente è quasi alla fine della pagina
    if (window.scrollY + viewportHeight >= pageHeight - 50) {
      // cerco un'ultima sezione (call to action)
      const lastSection = document.getElementById('ctaSection');
      // se esiste e l'utente ha scrollato fino in fondo
      if (lastSection && window.scrollY + viewportHeight >= lastSection.offsetTop + lastSection.offsetHeight - 50) {
        // imposto l'id della sezione attiva
        currentActiveSectionId = lastSection.id;
      }
    }
    // altrimenti se lo scroll è compreso tra l'inizio e la fine di una sezione
    else if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      // imposta quella sezione come quella attiva
      currentActiveSectionId = section.id;
    }
  });

  // rimuovo la classe "active-link-pirelli" da tutti i link tranne che quelli nel dropdown della selezione della lingua
  navLinks.forEach(link => {
    // se il link fa parte del menu a tendina della lingua, lo saltiamo
    if (link.closest('.nav-item.dropdown')) return;
    // rimuovo la classe "active-link-pirelli"
    link.classList.remove('active-link-pirelli');
  });

  // se l'id è presente attivo il link corrispondente
  if (currentActiveSectionId) {
    // creo un selettore per trovare il link associato alla sezione attiva
    const activeLink = document.querySelector(`.nav-link[href="#${currentActiveSectionId}"]`);
    // se esiste aggiungo la classe per evidenziare il link attivo
    if (activeLink) {
      activeLink.classList.add('active-link-pirelli');
    }
  }

  // se l’utente si trova in cima alla pagina
  if (window.scrollY < navbarHeight + 50) {
    // seleziono il link Home che punta alla sezione #top
    const homeLink = document.querySelector('.nav-link[href="#top"]');
    // se esiste lo evidenzio come attivo
    if (homeLink) {
      homeLink.classList.add('active-link-pirelli');
    }
  }
}

// ============================================================
// Metodo per la gestione per il bottone "Torna su"
// ============================================================

/**
 * Gestisce la visibilità e il comportamento del pulsante "Torna su"
 */
function setupGoToTopButton() {
  // seleiono il pulsante "Toena su"
  const goToTopButton = document.querySelector('.go-to-top');

  // gestisco l'evento scroll per mostrare o nascondere
  // il bottone in base alla posizione di scroll
  window.addEventListener('scroll', function () {
    // se lo scroll è avvenuto per almeno 200px
    if (window.scrollY > 200) {
      // mostro bottone applicando la classe display: flex allo stile
      goToTopButton.style.display = 'flex';
    } else {
      // nascondo il bottone applicando la classe display: none allo stile
      goToTopButton.style.display = 'none';
    }
  });

  // gestisco l'evento di click del pulsante "Torn su"
  goToTopButton.addEventListener('click', function (e) {
    // evito il comportamento standard del link
    e.preventDefault();
    // eseguo uno scroll della pagina verso l'alto
    // utilizzando un'anumazione di tipo smooth
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================================
// Gestione per l'evento di caricamento del DOM
// ============================================================

/**
 * Inizializza le funzionalità di multilingua e gestione navbar una volta che il DOM è stato caricato
 */
document.addEventListener('DOMContentLoaded', () => {
  // inizializzo la lingua corrente
  initializeLanguage();

  // seleziono tutti gli elementi del menu a tendina che contengono l'attributo data-lang
  document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
    // aggiungo il gestore eventi del click su ogni elemento
    item.addEventListener('click', async function (event) {
      // evito il comportamento standard del link
      event.preventDefault();

      // recupero la lingua selezionata dal click
      const lang = this.getAttribute('data-lang');
      // stampo un messaggio in console per il debug
      console.log(`Cliccato su lingua: "${lang}"`);

      // carica le traduzioni per la lingua selezionata
      const loaded = await loadTranslations(lang);
      // se le traduzioni sono state caricate le applico 
      if (loaded) {
        applyTranslations(lang);
      }
    });
  });

  // aggiorna lo stato dei link attivi nella navbar all’avvio
  updateNavbarActiveLink();

  // rendo la navbar reattiva
  // attraverso la gestione degli eventi scroll e resize
  // per aggiornare lo stato dei link attivi
  window.addEventListener('scroll', updateNavbarActiveLink);
  window.addEventListener('resize', updateNavbarActiveLink);

  // richiamo il metodo per la gestione del pulsante "Torna su"
  setupGoToTopButton();
});
