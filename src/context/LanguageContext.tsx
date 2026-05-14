'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'it';

interface Translations {
  // Nav
  inicio: string;
  pronosticos: string;
  eliminatoria: string;
  posiciones: string;
  premios: string;
  reglamento: string;
  admin: string;

  // Auth
  emailNoReal: string;
  emailNoRealDesc: string;
  bienvenidoProde: string;
  bienvenidoProdeDesc: string;
  nombre: string;
  email: string;
  contrasena: string;
  iniciarSesion: string;
  registrarse: string;
  noTenesCuenta: string;
  yaTenesCuenta: string;
  cargando: string;

// Dashboard
  bienvenido: string;
  predicí: string;
  labelPronosticos: string;
  partidos: string;
  puntos: string;
  participantes: string;
  cargarPronosticos: string;
  verTabla: string;
  sobreElPozo: string;
  sobreElPozoDesc: string;
  comoFuncionaInscripcion: string;
  inscripcion25Euros: string;
  inscripcionTransferencia: string;
  inscripcionContado: string;
  premio1Desc: string;
  premio2Desc: string;
  premio3Desc: string;
  cuandoSeCierraInscripcion: string;
  partidosPredichos: string;
  porHacer: string;
  progresoPronosticos: string;
  todosLosPronosticosCargados: string;

  // General
  privado: string;

  // Pronosticos page
  cargarPronosticosTitle: string;
  faseGrupos: string;
  sistemaDePuntos: string;
  resultadoExacto: string;
  scoreCorrecto: string;
  ganadorScore: string;
  acertarGanadorNoScore: string;
  partidosLabel: string;
  puntosMax: string;
  todosExactos: string;
  exacto: string;
  winner: string;
  errado: string;
  partidoCerrado: string;
seCierraEn: string;
  seCierraEnMinutos: string;
  faseGruposLarga: string;
  guardarPronosticosGrupo: string;
  guardando: string;
  partidosListos: string;
  emailOContrasenaIncorrectos: string;
  esteEmailYaEstaRegistrado: string;
  laContrasenaDebeTenerAlMenos: string;
  errorAlIniciarSesion: string;
  tuNombre: string;

  // Posiciones page
  clasificacionGeneral: string;
  mundial2026DetalleDeAciertos: string;
  tuPosicion: string;
  lugar: string;
  puntosPartidos: string;
  puntosPremios: string;
  total: string;
  exactos: string;
  winners: string;
  errados: string;
  tablaCompleta: string;
  noHayParticipantes: string;
  invitaACompetir: string;
  verDetalles: string;
  ocultarDetalles: string;
  delLider: string;
  pts: string;
  sinPartidosJugados: string;
  efectividad: string;
  estasATantosDelLider: string;

  // Premios page
  premiosEspeciales: string;
  cincoPuntosPorCadaAcierto: string;
  premiosIndividuales: string;
  pronosticaLosMejores: string;
  ptsPorCada: string;
  maximoPuntosSiAcertasLos3: string;
  goleadorDelTorneo: string;
  asistidorDelTorneo: string;
  mvpDelTorneo: string;
  pais: string;
  jugador: string;
  seleccionáUnPaís: string;
  seleccionáUnJugador: string;
  guardando_2: string;
  guardarPronosticosDePremios: string;
  yaTenesTusPremiosCargados: string;
  completáTodosLosCampos: string;

  // Eliminatoria page
  faseEliminatoria: string;
  copaMundial2026: string;
  pronosticosDeFaseEliminatoria: string;
  alFinalDeLaFaseDeGrupos: string;
  suerteConTusPronosticos: string;
  fasesDelKnockout: string;
  fasesKnockout: string;
  comoFuncionanLosPuntos: string;
  exactoSignificaAcertarElScore: string;
  winnerSignificaAcertarQuienAvanza: string;
  verPronosticosDeFaseDeGrupos: string;

  // Reglamento page
  comoFuncionaElProde2026: string;
  participaLosResultadosDelMundial: string;
  sistemaDePuntos_2: string;
  faseDeGrupos72Partidos: string;
  scoreCorrectoEj: string;
  acertarGanadorNoScore_2: string;
  maximo: string;
  faseEliminatoria16Partidos: string;
  scoreCorrectoDelPartido: string;
  acertarQuienAvanza: string;
  fases: string;
  premiosIndividuales3premios: string;
  puntajeTotalMaximo: string;
  reglasGenerales: string;
  losPronosticosSePuedenModificar: string;
  hastaQueElPartidoComience: string;
  losEmpatesCuentanComoGanador: string;
  resultadoExacto5Pts: string;
  empatePredichoNoExacto2Pts: string;
  pronosticoIncorrecto0Pts: string;
  losPremiosSonIndependientes: string;
  noImportaSiTuEquipoPasa: string;
  enCasoDeEmpateEnPuntos: string;
  elDesempateFavoreAlQueTengaMas: string;
  resultadosSeCarganPost: string;
  losAdministradoresCarganResultados: string;
  criteriosDeDesempate: string;
  mayorCantidadDeResultadosExactos: string;
  mayorCantidadDeWinners: string;
  menorCantidadDeErrados: string;
  resumenRapido: string;
  tipo: string;
  maximo_2: string;
  casoDeEmpate: string;
  volverAlInicio: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Nav
    inicio: 'Inicio',
    pronosticos: 'Pronósticos',
    eliminatoria: 'Eliminatoria',
    posiciones: 'Posiciones',
    premios: 'Premios',
    reglamento: 'Reglamento',
    admin: 'Admin',
    
    // Auth
    emailNoReal: 'No hace falta que uses tu email real',
    emailNoRealDesc: 'Usá cualquier email inventado como torino123@email.com. Lo único importante es tu nombre — es para que sepamos quién es cada uno.',
    bienvenidoProde: '¡Hola! En este sitio jugamos un Prode (o Fantasy Calcio, para los italianos). La mayoría de los participantes somos del Mercato Centrale di Torino.',
    bienvenidoProdeDesc: 'No hacen falta datos reales, solamente tu nombre para que sepamos quién es quién. Para más información sobre cómo funciona, visitá la sección de Reglamento.',
    nombre: 'Nombre',
    email: 'Email',
    contrasena: 'Contraseña',
    iniciarSesion: 'Iniciar Sesión',
    registrarse: 'Registrarse',
    noTenesCuenta: '¿No tenés cuenta? ',
    yaTenesCuenta: '¿Ya tenés cuenta? ',
    cargando: 'Cargando...',
    
    // Dashboard
    bienvenido: '¡Bienvenido',
    predicí: 'Predicí los resultados del Mundial y competí con los demás.',
    labelPronosticos: 'Pronósticos',
    partidos: 'Partidos',
    puntos: 'Puntos',
    participantes: 'Participantes',
    cargarPronosticos: 'Cargar Pronósticos',
    verTabla: 'Ver Tabla de Posiciones',
    sobreElPozo: 'Sobre la Inscripción',
    sobreElPozoDesc: 'Como todo juego de apuestas, se debe hacer un depósito. La idea es que cada participante ingrese con 25 euros, para que se sume al pozo total.',
    comoFuncionaInscripcion: '¿Cómo funciona?',
    inscripcion25Euros: 'Cada jugador paga 25€ para participar. El pozo total se reparte entre los 3 mejores al final del torneo.',
    inscripcionTransferencia: 'Transferencia bancaria a un IBAN que se publicará proximamente',
    inscripcionContado: 'En efectivo si nos conocemos personalmente',
    premio1Desc: '1° Puesto',
    premio2Desc: '2° Puesto',
    premio3Desc: '3° Puesto',
    cuandoSeCierraInscripcion: 'Cuando se cierre la inscripción se publicará el pozo total y el % para cada uno de los 3 del podio.',
    partidosPredichos: 'partidos predichos',
    porHacer: 'por hacer',
    progresoPronosticos: 'Progreso de pronósticos',
    todosLosPronosticosCargados: '¡Todos los pronósticos cargados!',
    
    // General
    privado: 'Datos guardados de forma privada en Firebase',

    // Pronosticos page
    cargarPronosticosTitle: 'Cargar Pronósticos',
    faseGrupos: 'Fase de Grupos',
    sistemaDePuntos: 'Sistema de Puntos - Fase de Grupos',
    resultadoExacto: 'Resultado Exacto',
    scoreCorrecto: 'Score correcto',
    scoreCorrectoEj: 'Score correcto (ej: 2-1)',
    ganadorScore: 'Ganador',
    acertarGanadorNoScore: 'Acertar quién gana, no el score',
    acertarGanadorNoScore_2: 'Acertar ganador, no score',
    partidosLabel: 'Partidos',
    puntosMax: 'Puntos máx.',
    todosExactos: 'Todos exactos',
    exacto: 'Exacto',
winner: 'Ganador',
  errado: 'Errado',
  partidoCerrado: 'Cerrado',
seCierraEn: 'Se cierra en',
    seCierraEnMinutos: 'Se cierra en {m}m',
    faseGruposLarga: 'Fase de Grupos',
    guardarPronosticosGrupo: 'Guardar Pronósticos Grupo',
    guardando: 'Guardando...',
    guardando_2: 'Guardando...',
    partidosListos: '¡Pronósticos guardados!',
    emailOContrasenaIncorrectos: 'Email o contraseña incorrectos',
    esteEmailYaEstaRegistrado: 'Este email ya está registrado',
    laContrasenaDebeTenerAlMenos: 'La contraseña debe tener al menos 6 caracteres',
    errorAlIniciarSesion: 'Error al iniciar sesión. Intentá de nuevo.',
    tuNombre: 'Tu nombre',

    // Posiciones page
    clasificacionGeneral: 'Clasificación General',
    mundial2026DetalleDeAciertos: 'Mundial 2026 • Detalle de aciertos',
    tuPosicion: 'Tu posición',
    lugar: 'lugar',
    puntosPartidos: 'Puntos Partidos',
    puntosPremios: 'Puntos Premios',
    total: 'Total',
    exactos: 'Exactos',
    winners: 'Winners',
    errados: 'Errados',
    tablaCompleta: 'Tabla Completa',
    noHayParticipantes: 'No hay participantes todavía',
    invitaACompetir: '¡Invita a competir!',
    verDetalles: 'Ver detalles',
    ocultarDetalles: 'Ocultar detalles',
    delLider: 'del líder',
    pts: 'pts',
    sinPartidosJugados: 'Sin partidos jugados aún',
    efectividad: 'Efectividad',
    estasATantosDelLider: 'Estás a {n} pts del líder',

    // Premios page
    premiosEspeciales: 'Premios Especiales',
    cincoPuntosPorCadaAcierto: '15 puntos por cada acierto',
    premiosIndividuales: 'Premios Individuales',
    pronosticaLosMejores: 'Pronosticá los mejores jugadores del torneo. Acertá y sumá',
    ptsPorCada: '+15 pts',
    maximoPuntosSiAcertasLos3: '15 puntos si acertás los 3',
    maximo: 'Máximo:',
    goleadorDelTorneo: 'Goleador del Torneo',
    asistidorDelTorneo: 'Asistidor del Torneo',
    mvpDelTorneo: 'MVP del Torneo (Balón de Oro)',
    pais: 'País',
    jugador: 'Jugador',
    seleccionáUnPaís: 'Seleccioná un país',
    seleccionáUnJugador: 'Seleccioná un jugador',
    guardarPronosticosDePremios: 'Guardar Pronósticos de Premios',
    yaTenesTusPremiosCargados: 'Ya tenés tus premios cargados',
    completáTodosLosCampos: 'Completá todos los campos',

    // Eliminatoria page
    faseEliminatoria: 'Fase Eliminatoria',
    copaMundial2026: 'Copa Mundial 2026',
    pronosticosDeFaseEliminatoria: '¡Pronósticos de Fase Eliminatoria!',
    alFinalDeLaFaseDeGrupos: 'Al final de la fase de grupos se cargarán los 16 equipos clasificados y podrás hacer tus predicciones.',
    suerteConTusPronosticos: '¡Suerte con tus pronósticos!',
    fasesDelKnockout: 'Fases del Knockout',
    fasesKnockout: 'Fases del Knockout',
    comoFuncionanLosPuntos: '¿Cómo funcionan los puntos?',
    exactoSignificaAcertarElScore: 'En eliminatorias, un resultado exacto (7 pts) significa acertar el score final.',
    winnerSignificaAcertarQuienAvanza: 'Un winner (3 pts) significa acertar quién avanza, sin importar el score.',
    verPronosticosDeFaseDeGrupos: 'Ver Pronósticos de Fase de Grupos',

    // Reglamento page
    comoFuncionaElProde2026: '¿Cómo funciona el Prode 2026?',
    participaLosResultadosDelMundial: 'Participá los resultados del Mundial 2026 y competí con tus amigos.',
    sistemaDePuntos_2: 'Sistema de Puntos',
    faseDeGrupos72Partidos: 'Fase de Grupos (72 partidos)',
    faseEliminatoria16Partidos: 'Fase Eliminatoria (16 partidos)',
    scoreCorrectoDelPartido: 'Score correcto del partido',
    acertarQuienAvanza: 'Acertar quién avanza',
    fases: 'Fases:',
    premiosIndividuales3premios: 'Premios Individuales (3 premios)',
    puntajeTotalMaximo: 'Puntaje Total Máximo',
    reglasGenerales: 'Reglas Generales',
    losPronosticosSePuedenModificar: 'Los pronósticos se pueden modificar',
    hastaQueElPartidoComience: 'Hasta que el partido comience. Después queda cerrado.',
    losEmpatesCuentanComoGanador: 'Los empates cuentan como Ganador',
    resultadoExacto5Pts: 'Resultado exacto (ej: 1-1): 5 pts',
    empatePredichoNoExacto2Pts: 'Empate predicho sin score exacto (ej: predijiste 2-2 pero fue 1-1): 2 pts',
    pronosticoIncorrecto0Pts: 'Pronóstico incorrecto: 0 pts',
    losPremiosSonIndependientes: 'Los premios son independientes',
    noImportaSiTuEquipoPasa: 'No importa si tu equipo pasa o no, lo que importa es si el jugador gana el premio individual.',
    enCasoDeEmpateEnPuntos: 'En caso de empate en puntos',
    elDesempateFavoreAlQueTengaMas: 'El desempate favorece al que tenga más',
    resultadosSeCarganPost: 'Los resultados se cargan post-partido',
    losAdministradoresCarganResultados: 'Los administradores del Prode cargan los resultados reales después de cada partido.',
    criteriosDeDesempate: 'Criterios de Desempate',
    mayorCantidadDeResultadosExactos: 'Mayor cantidad de resultados exactos',
    mayorCantidadDeWinners: 'Mayor cantidad de winners',
    menorCantidadDeErrados: 'Menor cantidad de errados',
    resumenRapido: 'Resumen Rápido',
    tipo: 'Tipo',
    maximo_2: 'Máximo',
    casoDeEmpate: 'Caso de Empate (ej: 1-1)',
    volverAlInicio: 'Volver al Inicio',
  },
  it: {
    // Nav
    inicio: 'Home',
    pronosticos: 'Pronostici',
    eliminatoria: 'Eliminazione',
    posiciones: 'Classifica',
    premios: 'Premi',
    reglamento: 'Regolamento',
    admin: 'Admin',

    // Auth
    emailNoReal: 'Non c\'è bisogno che usi la tua email vera',
    emailNoRealDesc: 'Usa qualsiasi email inventato come torino123@email.com. L\'unica cosa importante è il tuo nome — è per sapere chi è ciascuno.',
    bienvenidoProde: '¡Ciao! In questo sito giochiamo a un Fantasy Calcio (o Prode, per gli argentini). La maggior parte dei partecipanti siamo del Mercato Centrale di Torino.',
    bienvenidoProdeDesc: 'Non servono dati reali, solo il tuo nome per sapere chi sei. Per maggiori informazioni su come funziona, visita la sezione Regolamento.',
    nombre: 'Nome',
    email: 'Email',
    contrasena: 'Password',
    iniciarSesion: 'Accedi',
    registrarse: 'Registrati',
    noTenesCuenta: 'Non hai un account? ',
    yaTenesCuenta: 'Hai già un account? ',
    cargando: 'Caricamento...',

    // Dashboard
    bienvenido: 'Benvenuto',
    predicí: 'Pronostica i risultati del Mondiale e competi con gli altri.',
    labelPronosticos: 'Pronostici',
    partidos: 'Partite',
    puntos: 'Punti',
    participantes: 'Partecipanti',
    cargarPronosticos: 'Carica Pronostici',
    verTabla: 'Vedi Classifica',
    sobreElPozo: 'Sull\'Iscrizione',
    sobreElPozoDesc: 'Come tutti i giochi di scommesse, devi fare un deposito. L\'idea è che ogni partecipante versi 25 euro per sommarsi al montepremi totale.',
    comoFuncionaInscripcion: 'Come funziona?',
    inscripcion25Euros: 'Ogni giocatore paga 25€ per partecipare. Il montepremi totale viene diviso tra i primi 3 alla fine del torneo.',
    inscripcionTransferencia: 'Bonifico bancario a un IBAN che verrà pubblicato a breve',
    inscripcionContado: 'In contanti se ci conosciamo di persona',
    premio1Desc: '1° Posto',
    premio2Desc: '2° Posto',
    premio3Desc: '3° Posto',
    cuandoSeCierraInscripcion: 'Quando le iscrizioni saranno chiuse, verrà pubblicato il montepremi totale e la % per ciascuno dei 3 del podio.',
    partidosPredichos: 'pronostici fatti',
    porHacer: 'da fare',
    progresoPronosticos: 'Progresso pronostici',
    todosLosPronosticosCargados: '¡Tutti i pronostici caricati!',

    // General
    privado: 'Dati salvati in modo privato su Firebase',

    // Pronosticos page
    cargarPronosticosTitle: 'Carica Pronostici',
    faseGrupos: 'Fase a Gironi',
    sistemaDePuntos: 'Sistema di Punti - Fase a Gironi',
    resultadoExacto: 'Risultato Esatto',
    scoreCorrecto: 'Punteggio corretto',
    scoreCorrectoEj: 'Punteggio corretto (es: 2-1)',
    ganadorScore: 'Vincitore',
    acertarGanadorNoScore: 'Indovina chi vince, non il punteggio',
    acertarGanadorNoScore_2: 'Indovina il vincitore, non il punteggio',
    partidosLabel: 'Partite',
    puntosMax: 'Punti max.',
    todosExactos: 'Tutti esatti',
    exacto: 'Esatto',
winner: 'Vincitore',
  errado: 'Sbagliato',
  partidoCerrado: 'Chiuso',
seCierraEn: 'Chiude tra',
    seCierraEnMinutos: 'Chiude tra {m}m',
    faseGruposLarga: 'Fase a Gironi',
    guardarPronosticosGrupo: 'Salva Pronostici Gruppo',
    guardando: 'Salvataggio...',
    guardando_2: 'Salvataggio...',
    partidosListos: '¡Pronostici salvati!',
    emailOContrasenaIncorrectos: 'Email o password errati',
    esteEmailYaEstaRegistrado: 'Questa email è già registrata',
    laContrasenaDebeTenerAlMenos: 'La password deve avere almeno 6 caratteri',
    errorAlIniciarSesion: 'Errore durante l\'accesso. Riprova.',
    tuNombre: 'Il tuo nome',

    // Posiciones page
    clasificacionGeneral: 'Classifica Generale',
    mundial2026DetalleDeAciertos: 'Mondiale 2026 • Dettaglio successi',
    tuPosicion: 'La tua posizione',
    lugar: '° posto',
    puntosPartidos: 'Punti Partite',
    puntosPremios: 'Punti Premi',
    total: 'Totale',
    exactos: 'Esatti',
    winners: 'Vincenti',
    errados: 'Sbagliati',
    tablaCompleta: 'Tabella Completa',
    noHayParticipantes: 'Nessun partecipante ancora',
    invitaACompetir: 'Invita a competere!',
    verDetalles: 'Vedi dettagli',
    ocultarDetalles: 'Nascondi dettagli',
    delLider: 'dal leader',
    pts: 'pts',
    sinPartidosJugados: 'Nessuna partita giocata ancora',
    efectividad: 'Efficacia',
    estasATantosDelLider: 'Sei a {n} pts dal leader',

    // Premios page
    premiosEspeciales: 'Premi Speciali',
    cincoPuntosPorCadaAcierto: '15 punti per ogni colpo',
    premiosIndividuales: 'Premi Individuali',
    pronosticaLosMejores: 'Pronostica i migliori giocatori del torneo. Indovina e ottieni',
    ptsPorCada: '+15 pts',
    maximoPuntosSiAcertasLos3: '15 punti se indovini tutti e 3',
    maximo: 'Massimo:',
    goleadorDelTorneo: 'Capocannoniere del Torneo',
    asistidorDelTorneo: 'Assistman del Torneo',
    mvpDelTorneo: 'MVP del Torneo (Pallone d\'Oro)',
    pais: 'Paese',
    jugador: 'Giocatore',
    seleccionáUnPaís: 'Seleziona un paese',
    seleccionáUnJugador: 'Seleziona un giocatore',
    guardarPronosticosDePremios: 'Salva Pronostici Premi',
    yaTenesTusPremiosCargados: 'Hai già i tuoi premi caricati',
    completáTodosLosCampos: 'Completa tutti i campi',

    // Eliminatoria page
    faseEliminatoria: 'Fase Eliminatoria',
    copaMundial2026: 'Coppa del Mondo 2026',
    pronosticosDeFaseEliminatoria: '¡Pronostici Fase Eliminatoria!',
    alFinalDeLaFaseDeGrupos: 'Alla fine della fase a gironi verranno caricate le 16 squadre classificate e potrai fare le tue previsioni.',
    suerteConTusPronosticos: 'Buona fortuna con i tuoi pronostici!',
    fasesDelKnockout: 'Fasi del Knockout',
    fasesKnockout: 'Fasi del Knockout',
    comoFuncionanLosPuntos: 'Come funzionano i punti?',
    exactoSignificaAcertarElScore: 'Nelle eliminatorie, un risultato esatto (7 pts) significa indovinare il punteggio finale.',
    winnerSignificaAcertarQuienAvanza: 'Un vincitore (3 pts) significa indovinare chi passa, senza importare il punteggio.',
    verPronosticosDeFaseDeGrupos: 'Vedi Pronostici Fase a Gironi',

    // Reglamento page
    comoFuncionaElProde2026: 'Come funziona il Prode 2026?',
    participaLosResultadosDelMundial: 'Partecipa ai risultati del Mondiale 2026 e compete con i tuoi amici.',
    sistemaDePuntos_2: 'Sistema di Punti',
    faseDeGrupos72Partidos: 'Fase a Gironi (72 partite)',
    faseEliminatoria16Partidos: 'Fase Eliminatoria (16 partite)',
    scoreCorrectoDelPartido: 'Punteggio corretto della partita',
    acertarQuienAvanza: 'Indovina chi passa',
    fases: 'Fasi:',
    premiosIndividuales3premios: 'Premi Individuali (3 premi)',
    puntajeTotalMaximo: 'Punteggio Totale Massimo',
    reglasGenerales: 'Regole Generali',
    losPronosticosSePuedenModificar: 'I pronostici possono essere modificati',
    hastaQueElPartidoComience: 'Fino a quando la partita inizia. Dopo è chiuso.',
    losEmpatesCuentanComoGanador: 'I pareggi contano come Vincitore',
    resultadoExacto5Pts: 'Punteggio esatto (es: 1-1): 5 pts',
    empatePredichoNoExacto2Pts: 'Pareggio predetto senza punteggio esatto (es: hai predetto 2-2 ma è stato 1-1): 2 pts',
    pronosticoIncorrecto0Pts: 'Pronostico errato: 0 pts',
    losPremiosSonIndependientes: 'I premi sono indipendenti',
    noImportaSiTuEquipoPasa: 'Non importa se la tua squadra passa o no, quello che importa è se il giocatore vince il premio individuale.',
    enCasoDeEmpateEnPuntos: 'In caso di parità di punti',
    elDesempateFavoreAlQueTengaMas: 'Lo spareggio favorisce chi ha più',
    resultadosSeCarganPost: 'I risultati vengono caricati dopo la partita',
    losAdministradoresCarganResultados: 'Gli amministratori del Prode caricano i risultati reali dopo ogni partita.',
    criteriosDeDesempate: 'Criteri di Spareggio',
    mayorCantidadDeResultadosExactos: 'Maggiore quantità di risultati esatti',
    mayorCantidadDeWinners: 'Maggiore quantità di vincitori',
    menorCantidadDeErrados: 'Minore quantità di sbagliati',
    resumenRapido: 'Riepilogo Rapido',
    tipo: 'Tipo',
    maximo_2: 'Massimo',
    casoDeEmpate: 'Caso di Pareggio (es: 1-1)',
    volverAlInicio: 'Torna all\'Inizio',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('prode-language') as Language;
    if (saved && (saved === 'es' || saved === 'it')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('prode-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}