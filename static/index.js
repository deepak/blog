const dynamicRequires = require.context('./', true, /.(html|svg)$/);
dynamicRequires.keys().forEach(dynamicRequires);