.PHONY: test

test: 
	@find test -name '*_test.js' | xargs -n 1 -t node
