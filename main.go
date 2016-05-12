package main

import (
	"flag"
	"fmt"
	"io/ioutil"
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

	log.SetFlags(log.Ltime | log.Lmicroseconds)

	// eff example site
	http.Handle("/www.eff.org/files/", http.StripPrefix("/www.eff.org/files/", http.FileServer(http.Dir("www.eff.org/files/"))))
	http.Handle("/www.eff.org/sites/", http.StripPrefix("/www.eff.org/sites/", http.FileServer(http.Dir("www.eff.org/sites/"))))
	http.HandleFunc("/www.eff.org/index.html", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request to:", r.URL.Path)

		r.ParseForm()
		if r.Form.Get("push") == "" || r.Form.Get("push") == "css" {
			w.Header().Add("Link", "</www.eff.org/files/css/css_r7mP1rcWJQ63n8Fdr5p_bAp2cVsr4IDoQbtzGzliANo.css>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/css/css_xE-rWrJf-fncB6ztZfd2huxqgxu4WO-qwma6Xer30m4.css>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/css/css_vZ_wrMQ9Og-YPPxa1q4us3N7DsZMJa-14jShHgRoRNo.css>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/css/css_2WDS6rAKK7kwjEKZtVIbWvbcKp7kyhaaJDneFaYyT34.css>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/css/css_43sKUz3HG7KOJQSVVW0hT6W7-EqA3vEXKduP02UVQTw.css>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/css/css_mhhV1yVGqP_Qqn-u74hMcrMPpfrZj3odebRQjphmZ5Y.css>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/css/css_Dm-SJfMUMI3Lq1IRh7yJYS8gMbJAhKw4i7TNs8uKI4I.css>; rel=preload;")
		}

		if r.Form.Get("push") == "" || r.Form.Get("push") == "js" {
			w.Header().Add("Link", "</www.eff.org/files/js/js_jpJjaUC0z8JMIyav5oQrYykDRUb64rpaUDpB4Y9aklU.js>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/js/js_s_L-qx31pYm4AOYQvCH7NIEVsKUI7hfThWDEWJZSym4.js>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/js/js_6J_fxLrsplKcEmRgJC-6QRLa7T_nJvQ7W6oH96gDKng.js>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/js/js_OWTzqYYA7y6juLuDtKlBec_ktkD9iEau8Adyq3MXYYY.js>; rel=preload;")
			w.Header().Add("Link", "</www.eff.org/files/js/js_aRe4mjwNkRq0UugCuQDnvErzl6bmOFX_DLCke_FfyYc.js>; rel=preload;")
		}

		file, err := ioutil.ReadFile(r.URL.Path[1:])
		if err != nil {
			log.Printf("err reading %s: %s", r.URL.Path, err)
			return
		}
		fmt.Fprint(w, string(file))
	})

	// index html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		// Push the resource by setting the Link header
		r.ParseForm()
		if r.Form.Get("push") == "" || r.Form.Get("push") == "css" {
			w.Header().Add("Link", "</static/main.css>; rel=preload;")
		}
		if r.Form.Get("push") == "" || r.Form.Get("push") == "js" {
			w.Header().Add("Link", "</static/main.js>; rel=preload;")
		}

		fmt.Fprint(w, `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="/static/main.css">
  </head>
  <body>
    <div style="text-align: center; background: black;padding: 15px;margin: -10px;"><a href="?push=none">Disable Push</a> | <a href="?push=css">Push CSS</a> | <a href="?push=js">Push JS</a> | <a href="?push=">Push All</a></div>
    <h1>HTTP/2 Server Push</h1>
	<p>See <a href="https://bradleyf.id.au/dev/go-http2-server-push-fork/">details</a> and <a href="https://github.com/bradleyfalzon/h2push-demo">source</a></p>
	<p id="cssp">CSS was pushed</p>
	<p id="cssnp">CSS was not pushed</p>
	<p id="jsout"></p>
	<hr>
	<a href="https://twitter.com/bradleyfalzon">@bradleyfalzon</a> | <a href="www.eff.org/index.html">See EFF site via HTTP/2 Push</a>
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
