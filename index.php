<?php

declare(strict_types=1);

use Kirby\Cms\App;
use Scottboms\Logger;

// try composer autoload (works when plugin is installed via composer)
$composerAutoload = __DIR__ . '/vendor/autoload.php';
if (is_file($composerAutoload)) {
  require_once $composerAutoload;
}

// fallback for zip installs (no vendor/)
if (!class_exists(\Scottboms\Logger\Log::class, false)) {
	@include_once __DIR__ . '/classes/Log.php';
}

// shamelessly borrowed from distantnative/retour-for-kirby
if (
	version_compare(App::version() ?? '0.0.0', '4.0.1', '<') === true ||
	version_compare(App::version() ?? '0.0.0', '6.0.0', '>=') === true
) {
	throw new Exception('Logger requires Kirby v4 or v5');
}

Kirby::plugin('scottboms/logger', [
	'info' => [
		'homepage' => 'https://github.com/scottboms/kirby-logger',
		'version'  => '1.0.0',
		'license'  => 'MIT',
		'authors'  => [[ 'name' => 'Scott Boms' ]],
	],

	'options' => [
		'dir'      => null,          // where to write logs, null => kirby()->root('logs')
		'filename' => 'logger.log', // log file name

		// rotation (disabled if maxSize <= 0 or maxFiles < 1)
		'rotate'   => [
			'maxSize'  => 1024 * 1024, // 1 MB
			'maxFiles' => 5,           // keep up to N rotated files (file.log.1 ... file.log.N)
		],
	],

	// convenience method: kirby()->log('apple-music','info','Saved token')
	'methods' => [
		'log' => function (string $platform, string $level, string $message): void {
			\Scottboms\Logger\Log::log($platform, $level, $message);
		},
	],
]);
