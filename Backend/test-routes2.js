const app = require('./app');

console.log("App loaded.");
const authRoutes = require('./routes/authRoutes');

console.log("authRoutes typeof: ", typeof authRoutes);
if (authRoutes.stack) {
  authRoutes.stack.forEach(layer => {
    if (layer.route) {
        console.log("authRoutes route:", layer.route.path, layer.route.methods);
    }
  });
}

app._router.stack.forEach(layer => {
    if (layer.name === 'router') {
        console.log("Found router middleware at path:", layer.regexp);
    } else if (layer.route) {
        console.log("Found direct route:", layer.route.path);
    }
});
