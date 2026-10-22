export const ambientMotionRate: number;
export const ambientFrameRate: number;
export function isAmbientFrame(time: number, previousTime: number | null): boolean;

export interface AmbientPauseController {
  isPaused(): boolean;
  subscribe(listener: () => void): () => void;
  pause(): () => void;
}

export function createAmbientPause(): AmbientPauseController;

export interface ModalFrameDriver {
  request(callback: () => void): number;
  cancel(frame: number): void;
}

export function createModalMotionGate(
  ambient: AmbientPauseController,
  frames?: ModalFrameDriver,
): {
  isPending(): boolean;
  open(callback: () => void, immediate?: boolean): void;
  finish(): void;
};
