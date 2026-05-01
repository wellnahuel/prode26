import { Timestamp } from 'firebase/firestore';

function createTimestamp(dateStr: string, hour: number): Timestamp {
  const date = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00`);
  date.setHours(date.getHours() + 5); // EST to UTC
  return Timestamp.fromDate(date);
}

export interface PartidoData {
  id: string;
  fase: 'grupos';
  grupo: string;
  equipoA: string;
  nombreA: string;
  equipoB: string;
  nombreB: string;
  fechaInicio: Timestamp;
  estadio: string;
}

export const PARTIDOS_GRUPOS: PartidoData[] = [
  // JORNADA 1
  { id: 'g1-mex-rsa', fase: 'grupos', grupo: 'A', equipoA: 'MEX', nombreA: 'México', equipoB: 'RSA', nombreB: 'Sudáfica', fechaInicio: createTimestamp('2026-06-11', 15), estadio: 'Ciudad de México' },
  { id: 'g1-kor-cze', fase: 'grupos', grupo: 'A', equipoA: 'KOR', nombreA: 'República de Corea', equipoB: 'CZE', nombreB: 'República Checa', fechaInicio: createTimestamp('2026-06-11', 22), estadio: 'Guadalajara' },
  { id: 'g1-can-bih', fase: 'grupos', grupo: 'B', equipoA: 'CAN', nombreA: 'Canadá', equipoB: 'BIH', nombreB: 'Bosnia y Herzegovina', fechaInicio: createTimestamp('2026-06-12', 15), estadio: 'Toronto' },
  { id: 'g1-usa-par', fase: 'grupos', grupo: 'D', equipoA: 'USA', nombreA: 'Estados Unidos', equipoB: 'PAR', nombreB: 'Paraguay', fechaInicio: createTimestamp('2026-06-12', 21), estadio: 'Los Ángeles' },
  { id: 'g1-qat-sui', fase: 'grupos', grupo: 'B', equipoA: 'QAT', nombreA: 'Catar', equipoB: 'SUI', nombreB: 'Suiza', fechaInicio: createTimestamp('2026-06-13', 15), estadio: 'Bahía de San Francisco' },
  { id: 'g1-bra-mar', fase: 'grupos', grupo: 'C', equipoA: 'BRA', nombreA: 'Brasil', equipoB: 'MAR', nombreB: 'Marruecos', fechaInicio: createTimestamp('2026-06-13', 18), estadio: 'Nueva York Nueva Jersey' },
  { id: 'g1-hai-sco', fase: 'grupos', grupo: 'C', equipoA: 'HAI', nombreA: 'Haití', equipoB: 'SCO', nombreB: 'Escocia', fechaInicio: createTimestamp('2026-06-13', 21), estadio: 'Boston' },
  { id: 'g1-aus-tur', fase: 'grupos', grupo: 'D', equipoA: 'AUS', nombreA: 'Australia', equipoB: 'TUR', nombreB: 'Turquía', fechaInicio: createTimestamp('2026-06-13', 0), estadio: 'BC Place Vancouver' },
  { id: 'g1-ger-cuw', fase: 'grupos', grupo: 'E', equipoA: 'GER', nombreA: 'Alemania', equipoB: 'CUW', nombreB: 'Curazao', fechaInicio: createTimestamp('2026-06-14', 13), estadio: 'Houston' },
  { id: 'g1-ned-jpn', fase: 'grupos', grupo: 'F', equipoA: 'NED', nombreA: 'Países Bajos', equipoB: 'JPN', nombreB: 'Japón', fechaInicio: createTimestamp('2026-06-14', 16), estadio: 'Dallas' },
  { id: 'g1-civ-ecu', fase: 'grupos', grupo: 'E', equipoA: 'CIV', nombreA: 'Costa de Marfil', equipoB: 'ECU', nombreB: 'Ecuador', fechaInicio: createTimestamp('2026-06-14', 19), estadio: 'Filadelfia' },
  { id: 'g1-swe-tun', fase: 'grupos', grupo: 'F', equipoA: 'SWE', nombreA: 'Suecia', equipoB: 'TUN', nombreB: 'Túnez', fechaInicio: createTimestamp('2026-06-14', 22), estadio: 'Monterrey' },
  { id: 'g1-esp-cpv', fase: 'grupos', grupo: 'H', equipoA: 'ESP', nombreA: 'España', equipoB: 'CPV', nombreB: 'Cabo Verde', fechaInicio: createTimestamp('2026-06-15', 12), estadio: 'Atlanta' },
  { id: 'g1-bel-egy', fase: 'grupos', grupo: 'G', equipoA: 'BEL', nombreA: 'Bélgica', equipoB: 'EGY', nombreB: 'Egipto', fechaInicio: createTimestamp('2026-06-15', 15), estadio: 'Seattle' },
  { id: 'g1-ksa-uru', fase: 'grupos', grupo: 'H', equipoA: 'KSA', nombreA: 'Arabia Saudita', equipoB: 'URU', nombreB: 'Uruguay', fechaInicio: createTimestamp('2026-06-15', 18), estadio: 'Miami' },
  { id: 'g1-iran-nzl', fase: 'grupos', grupo: 'G', equipoA: 'IRN', nombreA: 'Irán', equipoB: 'NZL', nombreB: 'Nueva Zelanda', fechaInicio: createTimestamp('2026-06-15', 21), estadio: 'Los Ángeles' },
  { id: 'g1-fra-sen', fase: 'grupos', grupo: 'I', equipoA: 'FRA', nombreA: 'Francia', equipoB: 'SEN', nombreB: 'Senegal', fechaInicio: createTimestamp('2026-06-16', 15), estadio: 'Nueva York Nueva Jersey' },
  { id: 'g1-irq-nor', fase: 'grupos', grupo: 'I', equipoA: 'IRQ', nombreA: 'Irak', equipoB: 'NOR', nombreB: 'Noruega', fechaInicio: createTimestamp('2026-06-16', 18), estadio: 'Boston' },
  { id: 'g1-arg-alg', fase: 'grupos', grupo: 'J', equipoA: 'ARG', nombreA: 'Argentina', equipoB: 'ALG', nombreB: 'Argelia', fechaInicio: createTimestamp('2026-06-16', 21), estadio: 'Kansas City' },
  { id: 'g1-aut-jor', fase: 'grupos', grupo: 'J', equipoA: 'AUT', nombreA: 'Austria', equipoB: 'JOR', nombreB: 'Jordania', fechaInicio: createTimestamp('2026-06-16', 0), estadio: 'Bahía de San Francisco' },
  { id: 'g1-por-cod', fase: 'grupos', grupo: 'K', equipoA: 'POR', nombreA: 'Portugal', equipoB: 'COD', nombreB: 'RD Congo', fechaInicio: createTimestamp('2026-06-17', 13), estadio: 'Houston' },
  { id: 'g1-eng-cro', fase: 'grupos', grupo: 'L', equipoA: 'ENG', nombreA: 'Inglaterra', equipoB: 'CRO', nombreB: 'Croacia', fechaInicio: createTimestamp('2026-06-17', 16), estadio: 'Dallas' },
  { id: 'g1-gha-pan', fase: 'grupos', grupo: 'L', equipoA: 'GHA', nombreA: 'Ghana', equipoB: 'PAN', nombreB: 'Panamá', fechaInicio: createTimestamp('2026-06-17', 19), estadio: 'Toronto' },
  { id: 'g1-uzb-col', fase: 'grupos', grupo: 'K', equipoA: 'UZB', nombreA: 'Uzbekistán', equipoB: 'COL', nombreB: 'Colombia', fechaInicio: createTimestamp('2026-06-17', 22), estadio: 'Ciudad de México' },
  // JORNADA 2
  { id: 'g2-cze-rsa', fase: 'grupos', grupo: 'A', equipoA: 'CZE', nombreA: 'República Checa', equipoB: 'RSA', nombreB: 'Sudáfica', fechaInicio: createTimestamp('2026-06-18', 12), estadio: 'Atlanta' },
  { id: 'g2-sui-bih', fase: 'grupos', grupo: 'B', equipoA: 'SUI', nombreA: 'Suiza', equipoB: 'BIH', nombreB: 'Bosnia y Herzegovina', fechaInicio: createTimestamp('2026-06-18', 15), estadio: 'Los Ángeles' },
  { id: 'g2-can-qat', fase: 'grupos', grupo: 'B', equipoA: 'CAN', nombreA: 'Canadá', equipoB: 'QAT', nombreB: 'Catar', fechaInicio: createTimestamp('2026-06-18', 18), estadio: 'BC Place Vancouver' },
  { id: 'g2-mex-kor', fase: 'grupos', grupo: 'A', equipoA: 'MEX', nombreA: 'México', equipoB: 'KOR', nombreB: 'República de Corea', fechaInicio: createTimestamp('2026-06-18', 21), estadio: 'Guadalajara' },
  { id: 'g2-usa-aus', fase: 'grupos', grupo: 'D', equipoA: 'USA', nombreA: 'Estados Unidos', equipoB: 'AUS', nombreB: 'Australia', fechaInicio: createTimestamp('2026-06-19', 15), estadio: 'Seattle' },
  { id: 'g2-sco-mar', fase: 'grupos', grupo: 'C', equipoA: 'SCO', nombreA: 'Escocia', equipoB: 'MAR', nombreB: 'Marruecos', fechaInicio: createTimestamp('2026-06-19', 18), estadio: 'Boston' },
  { id: 'g2-bra-hai', fase: 'grupos', grupo: 'C', equipoA: 'BRA', nombreA: 'Brasil', equipoB: 'HAI', nombreB: 'Haití', fechaInicio: createTimestamp('2026-06-19', 21), estadio: 'Filadelfia' },
  { id: 'g2-tur-par', fase: 'grupos', grupo: 'D', equipoA: 'TUR', nombreA: 'Turquía', equipoB: 'PAR', nombreB: 'Paraguay', fechaInicio: createTimestamp('2026-06-19', 0), estadio: 'Bahía de San Francisco' },
  { id: 'g2-ned-swe', fase: 'grupos', grupo: 'F', equipoA: 'NED', nombreA: 'Países Bajos', equipoB: 'SWE', nombreB: 'Suecia', fechaInicio: createTimestamp('2026-06-20', 13), estadio: 'Houston' },
  { id: 'g2-ger-civ', fase: 'grupos', grupo: 'E', equipoA: 'GER', nombreA: 'Alemania', equipoB: 'CIV', nombreB: 'Costa de Marfil', fechaInicio: createTimestamp('2026-06-20', 16), estadio: 'Toronto' },
  { id: 'g2-ecu-cuw', fase: 'grupos', grupo: 'E', equipoA: 'ECU', nombreA: 'Ecuador', equipoB: 'CUW', nombreB: 'Curazao', fechaInicio: createTimestamp('2026-06-20', 22), estadio: 'Kansas City' },
  { id: 'g2-tun-jpn', fase: 'grupos', grupo: 'F', equipoA: 'TUN', nombreA: 'Túnez', equipoB: 'JPN', nombreB: 'Japón', fechaInicio: createTimestamp('2026-06-20', 0), estadio: 'Monterrey' },
  { id: 'g2-esp-ksa', fase: 'grupos', grupo: 'H', equipoA: 'ESP', nombreA: 'España', equipoB: 'KSA', nombreB: 'Arabia Saudita', fechaInicio: createTimestamp('2026-06-21', 12), estadio: 'Atlanta' },
  { id: 'g2-bel-iran', fase: 'grupos', grupo: 'G', equipoA: 'BEL', nombreA: 'Bélgica', equipoB: 'IRN', nombreB: 'Irán', fechaInicio: createTimestamp('2026-06-21', 15), estadio: 'Los Ángeles' },
  { id: 'g2-uru-cpv', fase: 'grupos', grupo: 'H', equipoA: 'URU', nombreA: 'Uruguay', equipoB: 'CPV', nombreB: 'Cabo Verde', fechaInicio: createTimestamp('2026-06-21', 18), estadio: 'Miami' },
  { id: 'g2-nzl-egy', fase: 'grupos', grupo: 'G', equipoA: 'NZL', nombreA: 'Nueva Zelanda', equipoB: 'EGY', nombreB: 'Egipto', fechaInicio: createTimestamp('2026-06-21', 21), estadio: 'BC Place Vancouver' },
  { id: 'g2-arg-aut', fase: 'grupos', grupo: 'J', equipoA: 'ARG', nombreA: 'Argentina', equipoB: 'AUT', nombreB: 'Austria', fechaInicio: createTimestamp('2026-06-22', 13), estadio: 'Dallas' },
  { id: 'g2-fra-irq', fase: 'grupos', grupo: 'I', equipoA: 'FRA', nombreA: 'Francia', equipoB: 'IRQ', nombreB: 'Irak', fechaInicio: createTimestamp('2026-06-22', 17), estadio: 'Filadelfia' },
  { id: 'g2-nor-sen', fase: 'grupos', grupo: 'I', equipoA: 'NOR', nombreA: 'Noruega', equipoB: 'SEN', nombreB: 'Senegal', fechaInicio: createTimestamp('2026-06-22', 20), estadio: 'Nueva York Nueva Jersey' },
  { id: 'g2-jor-alg', fase: 'grupos', grupo: 'J', equipoA: 'JOR', nombreA: 'Jordania', equipoB: 'ALG', nombreB: 'Argelia', fechaInicio: createTimestamp('2026-06-22', 23), estadio: 'Bahía de San Francisco' },
  { id: 'g2-por-uzb', fase: 'grupos', grupo: 'K', equipoA: 'POR', nombreA: 'Portugal', equipoB: 'UZB', nombreB: 'Uzbekistán', fechaInicio: createTimestamp('2026-06-23', 13), estadio: 'Houston' },
  { id: 'g2-eng-gha', fase: 'grupos', grupo: 'L', equipoA: 'ENG', nombreA: 'Inglaterra', equipoB: 'GHA', nombreB: 'Ghana', fechaInicio: createTimestamp('2026-06-23', 16), estadio: 'Boston' },
  { id: 'g2-pan-cro', fase: 'grupos', grupo: 'L', equipoA: 'PAN', nombreA: 'Panamá', equipoB: 'CRO', nombreB: 'Croacia', fechaInicio: createTimestamp('2026-06-23', 19), estadio: 'Toronto' },
  { id: 'g2-col-cod', fase: 'grupos', grupo: 'K', equipoA: 'COL', nombreA: 'Colombia', equipoB: 'COD', nombreB: 'RD Congo', fechaInicio: createTimestamp('2026-06-23', 22), estadio: 'Guadalajara' },
  // JORNADA 3
  { id: 'g3-sui-can', fase: 'grupos', grupo: 'B', equipoA: 'SUI', nombreA: 'Suiza', equipoB: 'CAN', nombreB: 'Canadá', fechaInicio: createTimestamp('2026-06-24', 15), estadio: 'BC Place Vancouver' },
  { id: 'g3-bih-qat', fase: 'grupos', grupo: 'B', equipoA: 'BIH', nombreA: 'Bosnia y Herzegovina', equipoB: 'QAT', nombreB: 'Catar', fechaInicio: createTimestamp('2026-06-24', 15), estadio: 'Seattle' },
  { id: 'g3-sco-bra', fase: 'grupos', grupo: 'C', equipoA: 'SCO', nombreA: 'Escocia', equipoB: 'BRA', nombreB: 'Brasil', fechaInicio: createTimestamp('2026-06-24', 18), estadio: 'Miami' },
  { id: 'g3-mar-hai', fase: 'grupos', grupo: 'C', equipoA: 'MAR', nombreA: 'Marruecos', equipoB: 'HAI', nombreB: 'Haití', fechaInicio: createTimestamp('2026-06-24', 18), estadio: 'Atlanta' },
  { id: 'g3-cze-mex', fase: 'grupos', grupo: 'A', equipoA: 'CZE', nombreA: 'República Checa', equipoB: 'MEX', nombreB: 'México', fechaInicio: createTimestamp('2026-06-24', 21), estadio: 'Ciudad de México' },
  { id: 'g3-rsa-kor', fase: 'grupos', grupo: 'A', equipoA: 'RSA', nombreA: 'Sudáfica', equipoB: 'KOR', nombreB: 'República de Corea', fechaInicio: createTimestamp('2026-06-24', 21), estadio: 'Monterrey' },
  { id: 'g3-cuw-civ', fase: 'grupos', grupo: 'E', equipoA: 'CUW', nombreA: 'Curazao', equipoB: 'CIV', nombreB: 'Costa de Marfil', fechaInicio: createTimestamp('2026-06-25', 16), estadio: 'Filadelfia' },
  { id: 'g3-ecu-ger', fase: 'grupos', grupo: 'E', equipoA: 'ECU', nombreA: 'Ecuador', equipoB: 'GER', nombreB: 'Alemania', fechaInicio: createTimestamp('2026-06-25', 16), estadio: 'Nueva York Nueva Jersey' },
  { id: 'g3-jpn-swe', fase: 'grupos', grupo: 'F', equipoA: 'JPN', nombreA: 'Japón', equipoB: 'SWE', nombreB: 'Suecia', fechaInicio: createTimestamp('2026-06-25', 19), estadio: 'Dallas' },
  { id: 'g3-tun-ned', fase: 'grupos', grupo: 'F', equipoA: 'TUN', nombreA: 'Túnez', equipoB: 'NED', nombreB: 'Países Bajos', fechaInicio: createTimestamp('2026-06-25', 19), estadio: 'Kansas City' },
  { id: 'g3-tur-usa', fase: 'grupos', grupo: 'D', equipoA: 'TUR', nombreA: 'Turquía', equipoB: 'USA', nombreB: 'Estados Unidos', fechaInicio: createTimestamp('2026-06-25', 22), estadio: 'Los Ángeles' },
  { id: 'g3-par-aus', fase: 'grupos', grupo: 'D', equipoA: 'PAR', nombreA: 'Paraguay', equipoB: 'AUS', nombreB: 'Australia', fechaInicio: createTimestamp('2026-06-25', 22), estadio: 'Bahía de San Francisco' },
  { id: 'g3-nor-fra', fase: 'grupos', grupo: 'I', equipoA: 'NOR', nombreA: 'Noruega', equipoB: 'FRA', nombreB: 'Francia', fechaInicio: createTimestamp('2026-06-26', 15), estadio: 'Boston' },
  { id: 'g3-sen-irq', fase: 'grupos', grupo: 'I', equipoA: 'SEN', nombreA: 'Senegal', equipoB: 'IRQ', nombreB: 'Irak', fechaInicio: createTimestamp('2026-06-26', 15), estadio: 'Toronto' },
  { id: 'g3-cpv-ksa', fase: 'grupos', grupo: 'H', equipoA: 'CPV', nombreA: 'Cabo Verde', equipoB: 'KSA', nombreB: 'Arabia Saudita', fechaInicio: createTimestamp('2026-06-26', 20), estadio: 'Houston' },
  { id: 'g3-uru-esp', fase: 'grupos', grupo: 'H', equipoA: 'URU', nombreA: 'Uruguay', equipoB: 'ESP', nombreB: 'España', fechaInicio: createTimestamp('2026-06-26', 20), estadio: 'Guadalajara' },
  { id: 'g3-egy-iran', fase: 'grupos', grupo: 'G', equipoA: 'EGY', nombreA: 'Egipto', equipoB: 'IRN', nombreB: 'Irán', fechaInicio: createTimestamp('2026-06-26', 23), estadio: 'Seattle' },
  { id: 'g3-nzl-bel', fase: 'grupos', grupo: 'G', equipoA: 'NZL', nombreA: 'Nueva Zelanda', equipoB: 'BEL', nombreB: 'Bélgica', fechaInicio: createTimestamp('2026-06-26', 23), estadio: 'BC Place Vancouver' },
  { id: 'g3-pan-eng', fase: 'grupos', grupo: 'L', equipoA: 'PAN', nombreA: 'Panamá', equipoB: 'ENG', nombreB: 'Inglaterra', fechaInicio: createTimestamp('2026-06-27', 17), estadio: 'Nueva York Nueva Jersey' },
  { id: 'g3-cro-gha', fase: 'grupos', grupo: 'L', equipoA: 'CRO', nombreA: 'Croacia', equipoB: 'GHA', nombreB: 'Ghana', fechaInicio: createTimestamp('2026-06-27', 17), estadio: 'Filadelfia' },
  { id: 'g3-col-por', fase: 'grupos', grupo: 'K', equipoA: 'COL', nombreA: 'Colombia', equipoB: 'POR', nombreB: 'Portugal', fechaInicio: createTimestamp('2026-06-27', 19), estadio: 'Miami' },
  { id: 'g3-cod-uzb', fase: 'grupos', grupo: 'K', equipoA: 'COD', nombreA: 'RD Congo', equipoB: 'UZB', nombreB: 'Uzbekistán', fechaInicio: createTimestamp('2026-06-27', 19), estadio: 'Atlanta' },
  { id: 'g3-alg-aut', fase: 'grupos', grupo: 'J', equipoA: 'ALG', nombreA: 'Argelia', equipoB: 'AUT', nombreB: 'Austria', fechaInicio: createTimestamp('2026-06-27', 22), estadio: 'Kansas City' },
  { id: 'g3-jor-arg', fase: 'grupos', grupo: 'J', equipoA: 'JOR', nombreA: 'Jordania', equipoB: 'ARG', nombreB: 'Argentina', fechaInicio: createTimestamp('2026-06-27', 22), estadio: 'Dallas' },
];

export const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;
export type Grupo = typeof GRUPOS[number];

export function getPartidosPorGrupo(grupo: Grupo) {
  return PARTIDOS_GRUPOS.filter((p) => p.grupo === grupo);
}

export function partidoHaComenzado(partido: { fechaInicio: Timestamp }): boolean {
  return Timestamp.now().toMillis() > partido.fechaInicio.toMillis();
}

export function ventanaPrediccionesAbierta(partido: { fechaInicio: Timestamp }): boolean {
  const cincoMinutos = 5 * 60 * 1000;
  return Timestamp.now().toMillis() < partido.fechaInicio.toMillis() - cincoMinutos;
}