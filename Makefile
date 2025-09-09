SHELL := bash

.PHONY: install lint format test coverage build

install:
	@npm $@

lint:
	@npm run $@

format:
	@npm run $@

test:
	@npx tsx --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=opt/lcov.info --test-update-snapshots

coverage:
	@npm run $@

build:
	@npm run $@