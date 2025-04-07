{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python39
    pkgs.mysql  # Thay postgresql_16 thành mysql
    pkgs.gcc
    pkgs.doc
  ];

  src = fetchurl {
    url = "http://example.com/valid-url.tar.gz";
    sha256 = "0v1h1k1...";
  };
}
