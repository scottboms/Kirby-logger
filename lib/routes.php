<?php

return [
	[
		'pattern' => 'logger/tail',
		'method'  => 'GET',
		'action'  => function () {
			// must be logged in to panel
			if (!$user = kirby()->user()) {
				throw new Exception('Unauthorized', 401);
			}

			$opts     = option('scottboms.logger', []);
			$dir      = $opts['dir']      ?? kirby()->root('logs');
			$filename = $opts['filename'] ?? 'logger.log';
			$logFile  = rtrim((string)$dir, '/\\') . DIRECTORY_SEPARATOR . $filename;

			$lines = (int)(get('lines') ?? 400);
			$lines = max(50, min($lines, 2000)); // safe bounds

			$content = '';
			if (\Kirby\Filesystem\F::exists($logFile)) {
				$content = \Kirby\Filesystem\F::read($logFile) ?? '';
				// tail the last N lines
				$parts   = explode("\n", $content);
				$content = implode("\n", array_slice($parts, -$lines));
			}

			return [
				'filename' => $filename,
				'lines'    => $lines,
				'content'  => $content,
			];
		},
	],
];
