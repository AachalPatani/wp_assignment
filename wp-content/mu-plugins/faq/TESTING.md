# Test Plan: devtask/faq block

- Delivered as a must-use plugin (`mu-plugins/devtask-faq-loader.php` and `mu-plugins/faq/`)


## 1. Automated checks
Run these from the `faq` folder. Each one must finish with no errors.

| ID | Command | Expected result | Result |
|---|---|---|---|
| A1 | `npm run lint:js` | No errors | |
| A2 | `npm run lint:css` | No errors | |
| A3 | `npm run test:unit` | All unit tests pass (22 tests) | |
| A4 | `npm run build` | Build completes with no errors | |

### Unit tests
The editor's list logic lives in `src/faq/utils.js` as pure functions, and the tests are in `/test/utils.test.js` (Jest). They check that:
- **addItem:** appends an empty item, works on an empty list, does not change the original array.
- **updateItem:** changes only the chosen field of the chosen item, works for questions and answers, does not change the original.
- **removeItem:** removes the first, a middle and the last item, does not change the original.
- **reorderItems:** moves first to last, last to first, middle to middle and one place up or down (the Move buttons). Every item is kept exactly once, and the same array is returned for equal, out-of-range or non-integer positions. The original array is never changed.
- **isItemEmpty:** true for an empty or missing item, false when a question or answer exists.

Testing tools (`jest`, `@babel/preset-env`) are listed under `devDependencies` only, so they are not part of the plugin at runtime. Jest uses its own Babel setup in `jest.config.js`, which does not affect the production build.

## 2. Manual test cases
Write Pass or Fail in the Result column for each case.

### 2.1 Block registration
| ID | Steps | Expected result | Result |
|---|---|---|---|
| T1 | Open Pages > Add New, click the inserter (+), search "FAQ" | The FAQ block is listed and can be inserted | |
| T2 | Insert the block, open the Code editor (menu > Code editor) | The markup starts with `<!-- wp:devtask/faq` | |
| T3 | Open Plugins > Must-Use | "DevTask FAQ Loader" is listed | |

### 2.2 FAQ management (editor)
| ID | Steps | Expected result | Result |
|---|---|---|---|
| T4 | Click "Add FAQ" three times | Three empty items appear | |
| T5 | Type text into a question field | Text is accepted and no formatting toolbar appears (plain text) | |
| T6 | Select text in an answer | Only bold, italic and link are offered (rich text) | |
| T7 | Fill several items, click Update, reload the editor | All questions and answers are still there | |
| T8 | Click Delete on an item that has content | "Confirm delete" and "Cancel" appear | |
| T9 | Click Cancel after T8 | The item stays and the normal Delete button returns | |
| T10 | Click Delete, then "Confirm delete" | The item is removed | |
| T11 | Click Delete on a completely empty item | The item is removed immediately, without a confirmation | |
| T12 | Click Delete on an item (do not confirm), then move another item | The pending confirmation is cleared | |
| T13 | Use Move up and Move down | The item moves one place. Move up is disabled on the first item and Move down on the last | |
| T14 | Press and hold the drag handle (⋮⋮) of the first item and drag it onto the last item, then release | The first item becomes the last. The hovered item shows a blue outline while dragging | |
| T15 | Drag the last item onto the first, then a middle item onto another middle item | Each item ends up at the drop position | |
| T16 | Release the drag handle outside any item | Nothing changes (order stays the same) | |
| T17 | Reorder, click Update, reload | The new order is kept | |
| T18 | Select text inside a question or answer with the mouse | Text is selected and no drag starts | |
| T19 | Use Tab to reach the Move up, Move down and Delete buttons and press Enter | Reordering and deleting work with the keyboard | |

### 2.3 Frontend
| ID | Steps | Expected result | Result |
|---|---|---|---|
| T20 | View the page and click a question | The answer expands. Click again to collapse | |
| T21 | Use Tab to reach a question, press Enter, then Space | The answer opens and closes with the keyboard | |
| T22 | Tab through the questions | A visible focus outline is shown | |
| T23 | Leave one question empty, save, view the page | That item is not output | |
| T24 | Publish the block with no FAQs | Nothing is output (no empty wrapper) | |
| T25 | Use bold, italic and a link in an answer | They render correctly on the frontend | |
| T26 | Open the page at 1200px, 768px and 375px widths (DevTools device toolbar) | The layout stays readable, with no horizontal scrolling | |
| T27 | Type a very long word without spaces in a question | It wraps and does not overflow the container | |
| T28 | Open DevTools > Network and reload the page | No `view.js` is loaded for this block | |
| T29 | Open the DevTools console on the frontend | No red errors and no "Hello World" message | |

### 2.4 Security
| ID | Steps | Expected result | Result |
|---|---|---|---|
| T30 | Enter `<script>alert(1)</script>` as a question and view the page | No alert. The text is shown literally | |
| T31 | View the page source (Ctrl + U) for that page | `&lt;script&gt;` is found and `<script>alert` is not | |
| T32 | Enter `<b>Hello</b>` as a question | It is shown literally, not rendered as bold | |
| T33 | In the Code editor, paste the markup below, then view the frontend | The `onerror` attribute is removed and no alert appears | |
| T34 | Open the URL of `render.php` inside the `build` folder directly in the browser | Blank page and no PHP errors (ABSPATH check) | |
| T35 | Turn on WP_DEBUG_LOG, repeat T4 to T25, then open `wp-content/debug.log` | No new PHP warnings or errors | |
| T36 | Open the browser console on the editor | No red errors | |

Markup for T33 (paste it in the Code editor, not the Visual editor):

`<!-- wp:devtask/faq {"faqs":[{"question":"XSS test","answer":"<img src=x onerror=alert(1)>Safe text"}]} /-->`

## 3. Requirement coverage
| Requirement | Covered by |
|---|---|
| 1. Block registration and inserter | T1, T2, T3 |
| 2. Add, edit (plain-text questions, rich-text answers), delete, reorder | T4 to T19, A3 (unit tests) |
| 3. Semantic, accessible, responsive frontend | T20 to T29 |
| 4. Sanitise and escape output, coding standards, no unnecessary dependencies | T30 to T36, A1, A2, A4 |

