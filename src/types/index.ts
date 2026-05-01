import { Timestamp } from 'firebase/firestore';

export interface Usuario {
  uid: string;
  displayName: string;
  email: string;
  fotoURL?: string;
  creadoEn: Timestamp;
}

export type Fase = 'grupos' | 'eliminatoria';
export type RondaEliminatoria = '16avos' | 'octavos' | 'cuartos' | 'semis' | 'tercer-puesto' | 'final';

export interface Partido {
  id: string;
  fase: Fase;
  grupo?: string;
  ronda?: RondaEliminatoria;
  equipoA: string;
  equipoB: string;
  nombreA: string;
  nombreB: string;
  fechaInicio: Timestamp;
  resultado?: { golesA: number; golesB: number };
  estadio?: string;
}

export type TipoPremio = 'goleador' | 'asistidor' | 'mvp';

export interface Pronostico {
  id: string;
  usuarioId: string;
  partidoId: string;
  golesPredichoA: number;
  golesPredichoB: number;
  creadoEn: Timestamp;
  actualizadoEn: Timestamp;
}

export interface PronosticoPremio {
  id: string;
  usuarioId: string;
  tipo: TipoPremio;
  valorPredicho: string;
  creadoEn: Timestamp;
}

export interface ResultadosTorneo {
  goleador: string;
  asistidor: string;
  mvp: string;
}

export type RondaPartido = 'grupos' | '16avos' | 'octavos' | 'cuartos' | 'semis' | 'tercer-puesto' | 'final';

export const PUNTOS_POR_RONDA: Record<RondaPartido, { exacto: number; ganador: number }> = {
  grupos: { exacto: 5, ganador: 2 },
  '16avos': { exacto: 7, ganador: 3 },
  octavos: { exacto: 7, ganador: 3 },
  cuartos: { exacto: 7, ganador: 3 },
  semis: { exacto: 7, ganador: 3 },
  'tercer-puesto': { exacto: 7, ganador: 3 },
  final: { exacto: 25, ganador: 10 },
};

export const PUNTOS_PREMIOS = 5;

export function getPuntosExacto(ronda: RondaPartido): number {
  return PUNTOS_POR_RONDA[ronda]?.exacto ?? 7;
}

export function getPuntosGanador(ronda: RondaPartido): number {
  return PUNTOS_POR_RONDA[ronda]?.ganador ?? 3;
}

export function calcularPuntos(
  prediccion: { golesPredichoA: number; golesPredichoB: number },
  partido: Partido
): number {
  if (!partido.resultado) return 0;

  const { golesA: realA, golesB: realB } = partido.resultado;
  const { golesPredichoA, golesPredichoB } = prediccion;

  const esExacto = realA === golesPredichoA && realB === golesPredichoB;

  const prediceGanadorA = golesPredichoA > golesPredichoB;
  const prediceGanadorB = golesPredichoB > golesPredichoA;
  const prediceEmpate = golesPredichoA === golesPredichoB;

  const realGanadorA = realA > realB;
  const realGanadorB = realB > realA;
  const realEmpate = realA === realB;

  const esGanadorCorrecto =
    (prediceGanadorA && realGanadorA) ||
    (prediceGanadorB && realGanadorB) ||
    (prediceEmpate && realEmpate);

  let ronda: RondaPartido = 'grupos';
  if (partido.fase === 'grupos') {
    ronda = 'grupos';
  } else if (partido.fase === 'eliminatoria' && partido.ronda) {
    ronda = partido.ronda;
  }

  if (esExacto) return getPuntosExacto(ronda);
  if (esGanadorCorrecto) return getPuntosGanador(ronda);
  return 0;
}

export function calcularPuntosPremio(
  prediccion: PronosticoPremio,
  resultadosTorneo: ResultadosTorneo
): number {
  switch (prediccion.tipo) {
    case 'goleador':
      return prediccion.valorPredicho === resultadosTorneo.goleador ? PUNTOS_PREMIOS : 0;
    case 'asistidor':
      return prediccion.valorPredicho === resultadosTorneo.asistidor ? PUNTOS_PREMIOS : 0;
    case 'mvp':
      return prediccion.valorPredicho === resultadosTorneo.mvp ? PUNTOS_PREMIOS : 0;
    default:
      return 0;
  }
}