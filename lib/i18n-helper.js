'use babel';

import _ from 'lodash';
import { Directory, CompositeDisposable } from 'atom';


export default {
  strings: new Set(),
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'i18n-helper:toggle': (event) => this.toggle(event)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {

    };
  },

  async toggle(event) {
    try {
      let path = event.target.getAttribute('data-path');

      if (!path) {
        return alert('Invalid path');
      }

      this.regex = /i18n\.__\(['"`]([\w\.]{3,})['"`]\)/g;
      const project = new Directory(`${path}imports`);

      // Get all files and folders on the working directory
      const entries = project.getEntriesSync();

      // Get all strings
      await this.getStrings(entries);

      // Get the i18n files in the folder
      const i18nPath = `${path}i18n`;
      const i18nFolder = new Directory(i18nPath);

      // Get all files and folders on the working directory
      const i18nFiles = i18nFolder.getEntriesSync();

      // Update strings in all i18n files
      await this.updateStrings(i18nFiles);

      atom.notifications.addSuccess('i18n files updated!');
    } catch (error) {
      console.log(error);
      atom.notifications.addError('i18n: There was an error!');
    } finally {
      this.strings = new Set();
    }
  },

  async getStrings(entries) {
    // Go through all files and folders and get all i18n strings
    await Promise.all(entries.map(async (entry) => {
      // If this is a file get i18n strings
      if (entry.isFile()) {
        const content = await entry.read(true);

        content.replace(this.regex, (match, string) => {
          this.strings.add(string);
        });
      } else {
        // Get all files and folders
        const entries = entry.getEntriesSync();

        await this.getStrings(entries);
      }
    }));
  },

  async updateStrings(entries) {
    // Go through all files and folders and get set all new i18n strings
    await Promise.all(entries.map(async (entry) => {
      // If this is a file get i18n strings
      if (entry.isFile()) {
        // If file doesnt include i18n on name dont update
        if (!entry.getBaseName() || !entry.getBaseName().includes('i18n')) {
          return;
        }

        // Get the file contents
        const content = await entry.read(true);
        let i18nObj, data;

        try {
          // Convert the content to JS Object
          i18nObj = JSON.parse(content);
        } catch (error) {
          console.log(error);
        }

        // Walk all the strings set
        this.strings.forEach((string) => {
          // Set the new string values
          const keys = string.split('.');
          const value = keys[keys.length - 1] || 'NEW VALUE';

          // If the string is not in the i18n file save it
          if (!_.get(i18nObj, string)) {
            _.set(i18nObj, string, value);
          }
        });

        try {
          data = JSON.stringify(i18nObj, undefined, 2);
        } catch (error) {
          console.log(error);
        }

        await entry.write(data);
      } else {
        // Get all files and folders
        const entries = entry.getEntriesSync();

        await this.updateStrings(entries);
      }
    }));
  }
};
