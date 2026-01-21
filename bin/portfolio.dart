import 'dart:io';

import 'package:rbws/rbws.dart';

import 'hit_manager.dart';

final HitManager hm = HitManager();

void main(List<String> args) {
  try {
    // Shared storage obj
    final store = RootedAutoreleasingStore(
      "dist/",
      defaultStorageDuration: Duration(days: 1),
    );

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
      storage: store,
    );

    insecureInstance.routeNotFound = (r) {
      final hit = hm.hit(r.headers["Cookie"]);
      final res = RBWSResponse.dataFromString(
        200,
        mainPageContent,
        toRequest: r,
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public,max-age=259200", // Allow for 3 days
          "Age": "0",
        },
      );
      if (hit != null) {
        res.headers["Set-Cookie"] =
            "sid=$hit; SameSite=strict; Max-Age=${Duration(hours: 2).inSeconds}";
      }
      return res;
    };

    insecureInstance.staticRoutes = {
      (.get, "/hits"): (request) {
        var content = "<h1>portfolio.frykman.dev hits</h1>\n";
        if (request.headers["Cookie"] != null) {
          content += "<b>Your Cookie: ${request.headers["Cookie"]}</b><br><ul>";
        }
        for (var session in hm.hits.entries) {
          content += "<li>${session.key}, ${session.value}</li>\n";
        }
        content += "</ul>";

        return RBWSResponse.dataFromString(
          HTTPStatusCode.ok,
          content,
          headers: {"Content-Type": "text/html"},
        );
      },
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
        securityContext: securityContext,
        storage: store,
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
