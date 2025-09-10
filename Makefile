SHELL := bash

.PHONY: install lint format test coverage build

install:
	@npm $@

lint:
	@npm run $@

format:
	@npm run $@

test:
	@npx tsx --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=test/lcov.info --test-update-snapshots

coverage:test
	@npx tsx codecov.ts

build:
	@npm run $@