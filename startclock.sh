#!/bin/bash
start_server() {
	pushd ~/olin-clock
	python -m SimpleHTTPServer
	popd
}

start_browser() {
	chromium-browser --kiosk -incognito http://localhost:8000
}

start_server &
start_browser &