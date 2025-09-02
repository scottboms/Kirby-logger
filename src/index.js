import Logger from './components/Logger.vue';
import { icons } from "./icons.js";

panel.plugin('scottboms/logger', {
  icons,
	components: {
    'k-logger-view': Logger,
  }
});
