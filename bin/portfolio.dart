import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:rbws/rbws.dart';

void main(List<String> args) {
  // Load index
  var index = File("public/index.html");
  if (!index.existsSync()) {
    stderr.writeln("Failed to find public/index.html, does not exist.");
    exit(256);
  }

  final mainPageContent = index.readAsStringSync();

  // Bring up insecure instance.
  final insecureInstance = HTTPServerInstance(
    InternetAddress.anyIPv4,
    80,
    generalServeRoot: "public/",
  );

  insecureInstance.routeNotFound = (r) {
    return RBWSResponse.dataFromString(
      200,
      mainPageContent,
      toRequest: r,
      headers: {"Content-Type": "text/html"},
    );
  };

  insecureInstance.start();

  // Try to bring up insecure instance
}
