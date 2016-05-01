package main

import (
	"flag"
	"fmt"
	"log"
	"net/http" // Post Go 1.6 HTTP/2 support
	"time"

	// Pre Go 1.6 HTTP/2 support
	//"golang.org/x/net/http2"

	// fork of golang.org/x/net/http2 with server push support
	"github.com/bradleyfalzon/net/http2"
)

func main() {
	// flags
	addr := flag.String("addr", ":443", "Address to listen to")
	cert := flag.String("cert", "cert.pem", "Path to TLS public certificate")
	key := flag.String("key", "key.pem", "Path to TLS private key")
	flag.Parse()

	// index html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		// Push this resource by setting the Link header
		w.Header().Add("Link", "/static/main.css")
		w.Header().Add("Link", "/static/main.js")

		fmt.Fprint(w, `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="/static/main.css">
  </head>
  <body>
    <h1>HTTP/2 Server Push</h1>
	<p>See <a href="https://bradleyf.id.au/dev/go-http2-server-push-fork/">details</a> and <a href="https://github.com/bradleyfalzon/h2push-demo">source</a></p>
	<p id="cssp">CSS was pushed</p>
	<p id="cssnp">CSS was not pushed</p>
	<p id="jsout"></p>
	<hr>
	<a href="https://twitter.com/bradleyfalzon">@bradleyfalzon</a>
	<script src="/static/main.js"></script>
  </body>
</html>`)
	})

	// CSS
	http.HandleFunc("/static/main.css", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/css")
		if _, ok := r.Header["H2push"]; ok {
			log.Println("request to main.css via pushed, host:", r.Host)
			fmt.Fprint(w, `html { background-color: #A1D490; } #cssnp { display: none; }`)
		} else {
			log.Println("request to main.css via request (non pushed)")
			fmt.Fprint(w, `html { background-color: #D4A190; } #cssp { display: none;}`)
		}
	})

	// JavaScript
	http.HandleFunc("/static/main.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/javascript")
		if _, ok := r.Header["H2push"]; ok {
			log.Println("request to main.js via pushed, host:", r.Host)
			fmt.Fprint(w, `document.getElementById('jsout').innerHTML = 'JavaScript was pushed';`)
		} else {
			log.Println("request to main.js via request (non pushed)")
			fmt.Fprint(w, `document.getElementById('jsout').innerHTML = 'JavaScript was not pushed';`)
		}
	})

	s := &http.Server{
		Addr:           *addr,
		Handler:        nil,
		ReadTimeout:    30 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	http2.ConfigureServer(s, nil)

	log.Println("Listening")
	log.Fatal(s.ListenAndServeTLS(*cert, *key))
}
