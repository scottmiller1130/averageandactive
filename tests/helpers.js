/**
 * Setup helper — loads site.js into a jsdom environment
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

function createDOM(html = '') {
  const minimalHTML = `<!DOCTYPE html><html><head></head><body>${html}</body></html>`;
  const dom = new JSDOM(minimalHTML, {
    url: 'https://averageandactive.com/',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });

  // Stub IntersectionObserver since jsdom doesn't support it
  dom.window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Load site.js — replace const with window assignment so tests can access Site
  let siteJS = fs.readFileSync(path.join(__dirname, '..', 'site.js'), 'utf8');
  siteJS = siteJS.replace("const Site = (() => {", "window.Site = (() => {");
  const scriptEl = dom.window.document.createElement('script');
  scriptEl.textContent = siteJS;
  dom.window.document.head.appendChild(scriptEl);

  return dom;
}

function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', filename), 'utf8'));
}

function readHTML(filename) {
  return fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
}

module.exports = { createDOM, loadJSON, readHTML };
