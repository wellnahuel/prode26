// Mapping de códigos FIFA a emojis de banderas
export const BANDERAS: Record<string, string> = {
  // A
  MEX: '🇲🇽',
  RSA: '🇿🇦',
  KOR: '🇰🇷',
  CZE: '🇨🇿',
  // B
  CAN: '🇨🇦',
  BIH: '🇧🇦',
  QAT: '🇶🇦',
  SUI: '🇨🇭',
  // C
  BRA: '🇧🇷',
  MAR: '🇲🇦',
  HAI: '🇭🇹',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  // D
  USA: '🇺🇸',
  PAR: '🇵🇾',
  AUS: '🇦🇺',
  TUR: '🇹🇷',
  // E
  GER: '🇩🇪',
  CUW: '🇨🇼',
  CIV: '🇨🇮',
  ECU: '🇪🇨',
  // F
  NED: '🇳🇱',
  JPN: '🇯🇵',
  SWE: '🇸🇪',
  TUN: '🇹🇳',
  // G
  BEL: '🇧🇪',
  EGY: '🇪🇬',
  IRN: '🇮🇷',
  NZL: '🇳🇿',
  // H
  ESP: '🇪🇸',
  CPV: '🇨🇻',
  KSA: '🇸🇦',
  URU: '🇺🇾',
  // I
  FRA: '🇫🇷',
  SEN: '🇸🇳',
  IRQ: '🇮🇶',
  NOR: '🇳🇴',
  // J
  ARG: '🇦🇷',
  ALG: '🇩🇿',
  AUT: '🇦🇹',
  JOR: '🇯🇴',
  // K
  POR: '🇵🇹',
  COD: '🇨🇩',
  UZB: '🇺🇿',
  COL: '🇨🇴',
  // L
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  CRO: '🇭🇷',
  GHA: '🇬🇭',
  PAN: '🇵🇦',
};

export function getBandera(codigo: string): string {
  return BANDERAS[codigo] || '🏳️';
}

export function getBanderaUrl(codigo: string): string {
  return `https://flagcdn.com/w80/${codigo.toLowerCase()}.png`;
}