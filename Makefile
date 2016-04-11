PHONY = build release

VERSION = $(shell git rev-parse HEAD)
BUILD = $(shell date +%Y%m%d%H%M%S)
REPO = quay.io/reevoo/visualiser
TAG := $(REPO):$(VERSION)_$(BUILD)

build:
	docker build -t $(TAG) .

release: build
release:
	docker push $(TAG)
