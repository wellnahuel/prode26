// UID del administrador (solo vos podes cargar resultados)
export const ADMIN_UID = 'YANsZ4IXZ6WmtaRRemOqh17UOOJ3';

export function isAdmin(uid: string): boolean {
  return uid === ADMIN_UID;
}