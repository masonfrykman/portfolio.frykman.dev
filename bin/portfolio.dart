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
  print(
    "Brought up insecure instance at ${insecureInstance.host} @ port ${insecureInstance.port}",
  );

  // Try to bring up secure instance
  if (Platform.environment["CERT_PRIV_KEY"] != null &&
      Platform.environment["CERT_PATH"] != null) {
    final securityContext = SecurityContext(withTrustedRoots: true);
    securityContext.useCertificateChain(Platform.environment["CERT_PATH"]!);
    securityContext.usePrivateKey(Platform.environment["CERT_PRIV_KEY"]!);

    final secureInstance = HTTPServerInstance(
      InternetAddress.anyIPv4,
      443,
      generalServeRoot: "public/",
      securityContext: securityContext,
    );

    secureInstance.routeNotFound = insecureInstance.routeNotFound;

    secureInstance.start();

    print(
      "Brought up secure instance at ${secureInstance.host} @ port ${secureInstance.port}",
    );
  }
}
