# vue-router Navigation API Router

And finally, the back and forward browser buttons detected.

This branch using this [feat: add navigation-api router](https://github.com/vuejs/router/pull/2551) PR.

Now the `vue-router` supports the [Navigation API](https://wicg.github.io/navigation-api/) and you can use the browser back and forward buttons.

Now we can use native view or vue transitions, to switch between the transition modes, just add or remove the `viewTransition: true,` line in the `createClientRouter` call, refresh the page and navigate with the header links or back and forward browser buttons.

You can also switch between Navigation API and Web History API router by adding or removing the `navigationApi` option or use Firefox or Safari that don't support the Navigation API.
