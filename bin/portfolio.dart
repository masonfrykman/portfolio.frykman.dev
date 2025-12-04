import 'dart:io';

import 'package:rbws/rbws.dart';

void main(List<String> args) {
  try {
    // Load index
    var index = File("dist/index.html");
    if (!index.existsSync()) {
      stderr.writeln("Failed to find dist/index.html, does not exist.");
      exit(256);
    }

    final mainPageContent = index.readAsStringSync();

    // Bring up insecure instance.
    final insecureInstance = HTTPServerInstance(
      InternetAddress.anyIPv4,
      80,
      generalServeRoot: "dist/",
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
        generalServeRoot: "dist/",
        securityContext: securityContext,
      );

      secureInstance.routeNotFound = insecureInstance.routeNotFound;

      secureInstance.start();

      print(
        "Brought up secure instance at ${secureInstance.host} @ port ${secureInstance.port}",
      );
    }
  } catch (x) {
    stderr.writeln("Caught exception:");
    stderr.writeln(x);
  }
}
