
build: modal-template.js lib/*.js components
	@component build

modal-template.js: templates/modal-template.html
	@component convert $<

components:
	@component install --dev

clean:
	rm -fr build components modal-template.js

