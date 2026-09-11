export function magnitude3d(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

export const LIMIAR_INSTABILIDADE_G = 2.0;
