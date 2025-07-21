/* tslint:disable */
/* eslint-disable */
export class Segment {
  private constructor();
  free(): void;
  length: number;
  angle: number;
  angular_speed: number;
  alpha: number;
  color_speed: number;
}
export class Spirograph {
  free(): void;
  constructor(segments: Array<any>, speed: number, width: number, height: number);
  clear_buffer(): void;
  draw_points(steps_per_frame: number, scale: number): void;
  getPixelBuffer(): Uint8Array;
  set_segments(segments: Array<any>): void;
  set_speed(speed: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_segment_free: (a: number, b: number) => void;
  readonly __wbg_get_segment_length: (a: number) => number;
  readonly __wbg_set_segment_length: (a: number, b: number) => void;
  readonly __wbg_get_segment_angle: (a: number) => number;
  readonly __wbg_set_segment_angle: (a: number, b: number) => void;
  readonly __wbg_get_segment_angular_speed: (a: number) => number;
  readonly __wbg_set_segment_angular_speed: (a: number, b: number) => void;
  readonly __wbg_get_segment_alpha: (a: number) => number;
  readonly __wbg_set_segment_alpha: (a: number, b: number) => void;
  readonly __wbg_get_segment_color_speed: (a: number) => number;
  readonly __wbg_set_segment_color_speed: (a: number, b: number) => void;
  readonly __wbg_spirograph_free: (a: number, b: number) => void;
  readonly spirograph_new: (a: any, b: number, c: number, d: number) => number;
  readonly spirograph_clear_buffer: (a: number) => void;
  readonly spirograph_draw_points: (a: number, b: number, c: number) => void;
  readonly spirograph_getPixelBuffer: (a: number) => any;
  readonly spirograph_set_segments: (a: number, b: any) => void;
  readonly spirograph_set_speed: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
