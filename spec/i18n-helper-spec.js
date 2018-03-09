'use babel';

import I18nHelper from '../lib/i18n-helper';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('I18nHelper', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('i18n-helper');
  });

  describe('when the i18n-helper:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.i18n-helper')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'i18n-helper:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.i18n-helper')).toExist();

        let i18nHelperElement = workspaceElement.querySelector('.i18n-helper');
        expect(i18nHelperElement).toExist();

        let i18nHelperPanel = atom.workspace.panelForItem(i18nHelperElement);
        expect(i18nHelperPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'i18n-helper:toggle');
        expect(i18nHelperPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.i18n-helper')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'i18n-helper:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let i18nHelperElement = workspaceElement.querySelector('.i18n-helper');
        expect(i18nHelperElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'i18n-helper:toggle');
        expect(i18nHelperElement).not.toBeVisible();
      });
    });
  });
});
