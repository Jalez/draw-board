/** @format */

import html2canvas from 'html2canvas';
import { ReactElement, useEffect, useRef, useState } from 'react';
// import './App.css';

// Allow cross origin requests

const sheet = new CSSStyleSheet();
// Get the existing style sheet
// const styleSheet = document.styleSheets[1];
// console.log('styleSheet', styleSheet);

let handleHtmlUpdate: (html: ReactElement) => void;

function App() {
	const boardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Once the component is mounted, send a message to the parent window
		window.parent.postMessage('mounted', '*');
	}, []);

	const [html, setHtml] = useState<ReactElement>();

	handleHtmlUpdate = (html: ReactElement) => {
		setHtml(html);
	};
	// Listen to changes from outside the iframe

	return <>{html ? html : <div>Loading</div>}</>;
}

window.addEventListener('message', (event) => {
	if (event.data === 'reload') {
		window.location.reload();
	}
	// If it countains new data, update the state
	if (event.data.html) {
		// turn the string into a ReactNode element and set it as the state of the component
		handleHtmlUpdate(
			<div dangerouslySetInnerHTML={{ __html: event.data.html }} />
		);
	}
	if (event.data.css) {
		// sheet.replaceSync(event.data.css);
		// document.adoptedStyleSheets = [sheet];
		// add the css as a style tag
		// remove the old style tag
		const oldStyle = document.querySelector('style');
		if (oldStyle) {
			oldStyle.remove();
		}
		const style = document.createElement('style');
		style.innerHTML = event.data.css;
		document.head.appendChild(style);
	}
	if (event.data === 'create image') {
		const board = document.getElementById('root');

		if (board) {
			html2canvas(board).then(function (canvas) {
				console.log('canvas', canvas);
				// get height and width of the canvas
				const height = canvas.height;
				const width = canvas.width;
				console.log('height', height);
				console.log('width', width);

				const dataURL = canvas.toDataURL();

				// send the data URL to the parent window
				window.parent.postMessage(dataURL, '*');
				// window.parent.postMessage(dataURL, '*');
			});
		}
	}
});

export default App;
