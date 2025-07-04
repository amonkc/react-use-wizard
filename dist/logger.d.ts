import { LogLevel } from './types';
/**
 * Log messages in the console with a corresponding urgency
 *
 * @param level The urgency of the message
 * @param message The message to log in the console
 */
export declare const log: (level: LogLevel, message: string) => void;
