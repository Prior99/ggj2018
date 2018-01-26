SHELL:=/bin/bash

default: debug

all: default lint db

.PHONY: debug
debug: node_modules
	yarn run build

.PHONY: release
release: node_modules
	yarn run build:release

.PHONY: node_modules
node_modules:
	yarn install

.PHONY: lint
lint: node_modules
	yarn run lint:src
	yarn run lint:style

.PHONY: run
run: node_modules
	yarn start

.PHONY: clean
clean:
	rm -Rf node_modules/
	rm -Rf server/
