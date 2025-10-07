import 'dart:io';

import 'package:rbws/rbws.dart';

void main(List<String> args) {
  HTTPServerInstance instance = HTTPServerInstance(
    InternetAddress.anyIPv4,
    8080,
    generalServeRoot: "public",
    defaultStorageLength: Duration(seconds: 0),
  );

  instance.onResponse = (res) {
    print(
      "[${DateTime.now()}] ${RBWSResponse.statusToString(res.status)} ${res.toRequest?.path}",
    );
  };

  instance.routeNotFound = (req) async {
    return RBWSResponse(
      200,
      data: File("public/index.html").readAsBytesSync(),
      headers: {"Content-Type": "text/html"},
      toRequest: req,
    );
  };

  instance.start();
}
