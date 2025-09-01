<?php

declare(strict_types=1);

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
		$rotate    = $options['rotate']   ?? ['maxSize' => 0, 'maxFiles' => 0];
		$logFile = rtrim((string)$dir, '/\\') . DIRECTORY_SEPARATOR . $filename;

		// ensure directory exists
		Dir::make($dir);

		// rotate if needed
		$maxSize  = (int)($rotate['maxSize']  ?? 0);
		$maxFiles = (int)($rotate['maxFiles'] ?? 0);

		if ($maxSize > 0 && $maxFiles > 0 && F::exists($logFile) && F::size($logFile) >= $maxSize) {
			self::rotate($logFile, $maxFiles);
		}

		$timestamp = date('Y-m-d H:i:s');
		$entry     = Str::unhtml("[$timestamp][" . strtoupper($level) . "][$platform] $message") . PHP_EOL;

		F::append($logFile, $entry);
	}

	/**
	 * simple N-file rotation: file -> file.1, file.1 -> file.2, ..., deletes file.N
	 */
	private static function rotate(string $logFile, int $maxFiles): void
	{
		// delete the oldest log
		$oldest = $logFile . '.' . $maxFiles;
		if (F::exists($oldest)) {
			  F::remove($oldest);
		}

		// shift the chain backwards
		for ($i = $maxFiles - 1; $i >= 1; $i--) {
			$src = $logFile . '.' . $i;
			$dst = $logFile . '.' . ($i + 1);
			if (F::exists($src)) {
				F::move($src, $dst, true);
			}
		}

		// current -> .1
		if (F::exists($logFile)) {
			F::move($logFile, $logFile . '.1', true);
		}
	}

}
