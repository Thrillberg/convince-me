const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
	const props = Object.getOwnPropertyNames(src)
		.filter(prop => typeof target[prop] === 'undefined')
		.map(prop => Object.getOwnPropertyDescriptor(src, prop));
	Object.defineProperties(target, props);
}

jsdom.reconfigure({ url: "http://www.some-url.com/" });

global.window = window;
global.document = window.document;
global.navigator = {
	userAgent: 'node.js',
};
copyProps(window, global);
