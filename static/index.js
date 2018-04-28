const dynamicRequires = require.context('./', true, /.(html|svg)$/);
dynamicRequires.keys().forEach(dynamicRequires);
import css from './postcss/index.pcss';