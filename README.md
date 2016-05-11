# HTTP/2 Server Push Demonstration

```
# Fetch lib providing h2 server push
go get -u github.com/bradleyfalzon/net/http2

# Generate demonstration SSL/TLS certificates
openssl req -x509 -newkey  rsa:2048 -keyout key.pem -out cert.pem -days 90 -nodes

# Build to local directory
go build

# Show frame dumps
export GODEBUG=http2debug=2

# View options
h2push-demo -help
```

# See Also

- https://github.com/bradleyfalzon/net/compare/1aafd77e1e7f6849ad16a7bdeb65e3589a10b2bb...bradleyfalzon:master

# Authors

- Bradley Falzon https://bradleyf.id.au [@bradleyfalzon](https://twitter.com/bradleyfalzon)
- See AUTHORS for Go for authors of http2 implementation: http://tip.golang.org/AUTHORS
