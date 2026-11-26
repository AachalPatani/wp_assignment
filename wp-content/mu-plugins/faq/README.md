# WordPress Assignment: Custom Gutenberg FAQ Block (`devtask/faq`)

This repository tracks the custom code of the assignment site. WordPress core,
uploads and third-party plugins are not included.

## Contents
- `wp-content/mu-plugins/devtask-faq-loader.php`: loads the block
- `wp-content/mu-plugins/faq/`: the `devtask/faq` block (source in `src/`, compiled output in `build/`)

## Install
Copy the contents of `wp-content/mu-plugins/` into the `wp-content/mu-plugins/` folder
of a WordPress site. The block loads automatically. In the editor, add a new block and search for "FAQ".

## Development
Run these from the repository root:
```bash
npm install
npm start          # development build with watch
npm run build      # production build
npm run lint:js
npm run lint:css
npm run test:unit  # Jest unit tests
```

## Documentation
- Block details and features: [wp-content/mu-plugins/faq/README.md](wp-content/mu-plugins/faq/README.md)
- Test plan: [wp-content/mu-plugins/faq/TESTING.md](wp-content/mu-plugins/faq/TESTING.md)