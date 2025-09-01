# Logger for Kirby

An easily reusable PHP logger plugin for Kirby. Helpful for debugging front-end templates and back-end code.

## Installation

### [Kirby CLI](https://github.com/getkirby/cli)

```bash
kirby plugin:install scottboms/kirby-logger
```

### Git submodule

```bash
git submodule add https://github.com/scottboms/kirby-logger.git site/plugins/kirby-logger
```

### Copy and Paste

1. [Download](https://github.com/scottboms/kirby-logger/archive/main.zip) the contents of this repository as Zip file.
2. Rename the extracted folder to `kirby-logger` and copy it into the `site/plugins/` directory in your Kirby project.

## Configuration Options

Optional configuration settings can be used to override plugin defaults.

| Property                         | Default       | Req? | Description                                    |
|----------------------------------|---------------|------|------------------------------------------------|
| scottboms.logger.dir             | `null`        | No   | By default writes to kirby's native log        |
| scottboms.logger.filename        | `logger.log`  | No   | The saved log filename                         |
| scottboms.logger.rotate.maxSize  | `1024 x 1024` | No   | The maxSize of log files (default: 1MB)        |
| scottboms.logger.rotate.maxFiles | `5`           | No   | Rotate up to 5 log files                       |

**Example Use (in config/config.php):**

```php
return [
  scottboms.logger.dir => 'logs',
  scottboms.logger.filename => 'custom.log',
  scottboms.logger.rotate => [
    'maxSize'  => 2048 x 2048,
    'maxFiles' => 2
  ],
],
```

## Usage

The logger is configured as a `siteMethod` and expects 3 string values -- the first is a `platform` keyword such as 'site', 'template', etc. The second is a `level` keyword (e.g. info, log, warn, error, success). The third is the message to log which can either be a string -- or can be arbitrary data from Kirby that can be converted to string values.

```php
<?php
  site()->log('site', 'info', 'This is the message to log.');
?>
```

## Compatibility

* Kirby 4.x
* Kirby 5.x


## Disclaimer

This plugin is provided "as is" with no guarantee. Use it at your own risk and always test before using it in a production environment. If you identify an issue, typo, etc, please [create a new issue](/issues/new) so I can investigate.


## License

[MIT](https://opensource.org/licenses/MIT)
