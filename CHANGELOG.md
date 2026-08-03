# Changelog

## 1.0.0 (2026-08-03)


### Features

* add Dockerfile and prepare for deployment ([8a13fdb](https://github.com/lytic11-web/python-project-386/commit/8a13fdbbe0523ae392347829eadd99682c305f3d))
* **ci:** add e2e tests with Playwright, CI workflow, and release-please ([7d22b5b](https://github.com/lytic11-web/python-project-386/commit/7d22b5ba9db6c5bcc93107f687ad24f130245da0))
* **frontend:** add live clock with date and weekday, rename nav labels ([06d68c1](https://github.com/lytic11-web/python-project-386/commit/06d68c13d86ef02f0b3835237c781420393a62ea))


### Bug Fixes

* **ci:** set reuseExistingServer=true in Playwright config to avoid port conflicts with CI manual server start ([fda4cfd](https://github.com/lytic11-web/python-project-386/commit/fda4cfd0527f22a3f62f3637ac73c696b0bad8b1))
* **ci:** simplify CI workflow, remove fragile pip/npm commands ([abc717a](https://github.com/lytic11-web/python-project-386/commit/abc717a03c666b19667836a75d6d0122b3df7c38))
* **docker:** use npm install instead of npm ci (no lockfile) ([326f7a0](https://github.com/lytic11-web/python-project-386/commit/326f7a08dd743ab0ea1bf6a3974ebc33f62cfc45))
* **e2e:** correct lucide icon class names (edit-3, trash-2, not edit3, trash2) ([0870e37](https://github.com/lytic11-web/python-project-386/commit/0870e3723e350d86cc12c3dfa835ef9cd5b9b94d))
* **e2e:** fix tests to match actual UI - add htmlFor/id to inputs, fix selectors for icon buttons, fix double-booking test ([4fb197f](https://github.com/lytic11-web/python-project-386/commit/4fb197f0ab637a04d3b70bec85828c7377c7e38b))
* **e2e:** locate action buttons by card-scoped filter instead of icon class ([398b5fe](https://github.com/lytic11-web/python-project-386/commit/398b5fe89d8dd967f8bf9f10acbbf11918755977))
* **e2e:** use getByRole for headings, filter locator for icon buttons, add dialog close wait and cleanup ([2aa1ddd](https://github.com/lytic11-web/python-project-386/commit/2aa1dddf45953da0179bfb420bba6323341e5490))
* filter started slots, add UTC timezone to booking responses ([14483a3](https://github.com/lytic11-web/python-project-386/commit/14483a3f7f9e9a1b8e9cf14ad010bee6c775c4ae))
* parse slot time as UTC in booking submission ([51ad9bd](https://github.com/lytic11-web/python-project-386/commit/51ad9bdd9ad4dea507271148f8e0501b60e62a47))
* remove unused imports that break tsc build in Docker ([b588f79](https://github.com/lytic11-web/python-project-386/commit/b588f7919c831a6caccf19d57b237da9428e2376))
