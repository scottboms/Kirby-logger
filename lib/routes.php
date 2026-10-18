<?php

use Kirby\Exception\PermissionException;
use Kirby\Filesystem\F;

return [
	[
		'pattern' => 'logger/tail',
		'method'  => 'GET',
		'action'  => function () {
			// Restrict access to administrators
			$user = kirby()->user();

			if (!$user || !$user->isAdmin()) {
				throw new \Kirby\Exception\PermissionException(
					'You are not authorized to view logs.'
				);
			}

			$options = option('scottboms.logger', []);
			$dir = $options['dir'] ?? kirby()->root('logs');
			$filename = $options['filename'] ?? 'logger.log';

			$logFile  = rtrim((string)$dir, '/\\') . DIRECTORY_SEPARATOR . $filename;

			// Validate requested line count
			$lines = (int)(get('lines') ?? 400);
			$lines = max(10, min($lines, 2000)); // safe bounds

			// Read the log contents
			$content = '';

			if (F::exists($logFile)) {
				$content = F::read($logFile) ?? '';

				// Remove trailing line breaks before splitting
				$content = rtrim($content, "\r\n");

				if ($content !== '') {
					$parts = explode("\n", $content);
					$content = implode("\n", array_slice($parts, -$lines));
				}
			}

			return [
				'filename' => $filename,
				'lines'    => $lines,
				'content'  => $content,
			];
		},
	],
];
