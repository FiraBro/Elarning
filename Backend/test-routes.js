const app = require('./app');
const routes = [];
app._router.stack.forEach(middleware => {
    if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(handler => {
            if (handler.route) routes.push({ path: handler.route.path, methods: handler.route.methods });
        });
    }
});
console.log(JSON.stringify(routes, null, 2));
