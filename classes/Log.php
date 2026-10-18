<?php

namespace Scottboms\Logger;

use Kirby\Filesystem\Dir;
use Kirby\Filesystem\F;
use Kirby\Toolkit\Str;

class Log
{
	/**
	 * write a single log entry, optionally rotating the file when size exceeds the configured max
	 *
	 * @param string $platform a short tag for the source (e.g. 'apple-music', 'mastodon')
	 * @param string $level    e.g. 'DEBUG', 'INFO', 'WARNING', 'ERROR'
	 * @param string $message  the message to log
	 */

	public static function log(string $platform, string $level, string $message): void
	{
		$kirby     = kirby();
		$options   = $kirby->option('scottboms.logger', []);
		$dir       = $options['dir'] ?? $kirby->root('logs');
		$filename  = $options['filename'] ?? 'logger.log';
		$rotate    = $options['rotate'] ?? ['maxSize' => 0, 'maxFiles' => 0];

		// rotate if needed
		$maxSize = (int)($rotate['maxSize'] ?? 0);
		$maxFiles = (int)($rotate['maxFiles'] ?? 0);

		// Ensure the directory exists
		Dir::make($dir);

		$logFile = rtrim((string)$dir, '/\\') . DIRECTORY_SEPARATOR . $filename;

		// Build the log entry
		$timestamp = date('Y-m-d H:i:s');

		$entry = Str::unhtml(
			"[$timestamp][" .
			strtoupper($level) .
			"][$platform] $message"
		) . PHP_EOL;

		// Rotate before writing if the next entry exceeds the limit
		if (
			$maxSize > 0 &&
			$maxFiles > 0 &&
			F::exists($logFile)
		) {
			$currentSize = F::size($logFile);
			if ($currentSize + strlen($entry) > $maxSize) {
				self::rotate($logFile, $maxFiles);
			}
		}

		// Append the new entry
		F::append($logFile, $entry);
	}

	/**
	 * Rotate log files:
	 *
	 * logger.log   -> logger.log.1
	 * logger.log.1 -> logger.log.2
	 * ...
	 */

	private static function rotate(
		string $logFile,
		int $maxFiles
	): void {
		// Remove the oldest file
		$oldest = $logFile . '.' . $maxFiles;

		if (F::exists($oldest)) {
			F::remove($oldest);
		}

		// Shift existing rotated files
		for ($i = $maxFiles - 1; $i >= 1; $i--) {
			$source = $logFile . '.' . $i;
			$destination = $logFile . '.' . ($i + 1);

			if (F::exists($source)) {
				F::move($source, $destination, true);
			}
		}

		// Move the current log to .1
		if (F::exists($logFile)) {
			F::move($logFile, $logFile . '.1', true);
		}
	}
}
