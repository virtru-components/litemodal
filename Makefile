
build: modal-template.js css-build lib/*.js components
	@component build

css-build: css/overlay.css css/virtru.css

modal-template.js: templates/modal-template.html
	@component convert $<

components:
	@component install --dev

clean:
	rm -fr build components modal-template.js

