/**
 * `audioPlayer` and `audioRecorder`, an `expo-audio` player and recorder owned by the component
 * that makes each.
 *
 * ```ts
 * protected readonly player = audioPlayer(this.source, { timeUpdate: 0.5 });
 * protected readonly recorder = audioRecorder(RecordingPresets.HIGH_QUALITY);
 *
 * // {{ player.state().currentTime }} {{ recorder.state().durationMillis }}
 * ```
 */
import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import { currentPlatform, expoModuleNow, unavailable } from './native.ts';
import { ownPlayer, watchAudioPlayer, type Player } from './player.ts';

type ExpoAudio = typeof import('expo-audio');
type RecordingOptions = import('expo-audio').RecordingOptions;
type RecorderState = import('expo-audio').RecorderState;
type AudioRecorder = import('expo-audio').AudioRecorder;

/** `expo-audio` where the platform has it, or the error that says why not. */
function expoAudio(): ExpoAudio {
  const expo = expoModuleNow('expo-audio', () => require('expo-audio') as ExpoAudio, [
    'ios',
    'android',
    'web',
  ]);
  if (!expo) throw unavailable('expo-audio', 'Stand in for the player or recorder in the test.');
  return expo;
}

/**
 * An audio player owned by the current component, released when it is destroyed.
 *
 * `expo-audio` has no `timeUpdateEventInterval` property to set after the fact - the interval is
 * an option to `createAudioPlayer` itself, in milliseconds rather than `videoPlayer`'s seconds.
 */
export function audioPlayer(
  source: import('expo-audio').AudioSource,
  options: { timeUpdate?: number } = {},
): Player<import('expo-audio').AudioPlayer> {
  const expo = expoAudio();
  const updateInterval = options.timeUpdate === undefined ? undefined : options.timeUpdate * 1000;
  const native = expo.createAudioPlayer(source, { updateInterval });
  return ownPlayer(native, () => watchAudioPlayer(native));
}

/** A component's own recorder: the module's, and its status as a signal. */
export interface Recorder<T> {
  /** The module's own recorder, for `prepareToRecordAsync()`, `record()`, `stop()` and the rest. */
  readonly native: T;
  /** `getStatus()`, asked every `statusInterval` milliseconds while the component lives. */
  readonly state: Signal<RecorderState>;
}

/**
 * An audio recorder owned by the current component, released when it is destroyed: what
 * `useAudioRecorder` and `useAudioRecorderState` give a React component.
 *
 * The recorder is made with `options` merged for the platform, as `useAudioRecorder` makes it, so
 * call `prepareToRecordAsync()` with none. Android reads `isMeteringEnabled` from these alone: a
 * recorder made without it and prepared with it has no `metering`.
 */
export function audioRecorder(
  options: RecordingOptions,
  { statusInterval = 500 }: { statusInterval?: number } = {},
): Recorder<AudioRecorder> {
  const expo = expoAudio();
  const native = new expo.AudioModule.AudioRecorder(forPlatform(options)) as AudioRecorder;
  const state = signal(native.getStatus(), { equal: sameStatus });
  const polling = setInterval(() => state.set(native.getStatus()), statusInterval);
  inject(DestroyRef).onDestroy(() => {
    clearInterval(polling);
    native.release?.();
  });
  return { native, state: state.asReadonly() };
}

/** `expo-audio`'s own `createRecordingOptions`, which it does not export: the platform's merged in. */
function forPlatform(options: RecordingOptions): Record<string, unknown> {
  const common = {
    extension: options.extension,
    sampleRate: options.sampleRate,
    numberOfChannels: options.numberOfChannels,
    bitRate: options.bitRate,
    isMeteringEnabled: options.isMeteringEnabled ?? false,
  };
  const platform = currentPlatform();
  if (platform === 'ios') return { ...common, directory: options.directory, ...options.ios };
  if (platform === 'android')
    return { ...common, directory: options.directory, ...options.android };
  return { ...common, ...options.web };
}

/** What `useAudioRecorderState` counts as no change: under 50 ms of duration, 0.1 dB of level. */
function sameStatus(a: RecorderState, b: RecorderState): boolean {
  const metering =
    a.metering === undefined || b.metering === undefined
      ? a.metering === b.metering
      : Math.abs(a.metering - b.metering) <= 0.1;
  return (
    a.canRecord === b.canRecord &&
    a.isRecording === b.isRecording &&
    a.mediaServicesDidReset === b.mediaServicesDidReset &&
    a.url === b.url &&
    Math.abs(a.durationMillis - b.durationMillis) <= 50 &&
    metering
  );
}
