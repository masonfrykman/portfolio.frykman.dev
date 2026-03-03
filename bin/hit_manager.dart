import 'package:uuid/uuid.dart';

class HitManager {
  Map<String, Map<String, int>> hits = {};

  String? hit(String? cookieHeader, {String path = "unspecified"}) {
    print(hits);

    String? id;

    // Get the ID from the cookie header if exists
    if (cookieHeader != null) {
      final cookies = cookieHeader.split("; ");
      for (var cookie in cookies) {
        if (cookie.startsWith("sid")) {
          final pair = cookie.split("=");
          if (pair.length != 2) {
            continue;
          }

          id = pair[1];
          break;
        }
      }
    }

    // If they don't have a valid id, make a new one and return it
    if (id == null || !hits.containsKey(id)) {
      var newID = Uuid().v4();
      hits[newID] = {};
      hits[newID]![path] = 1;
      return newID;
    }

    // Otherwise, log their hit and return null.
    hits[id]![path] = (hits[id]![path] ?? 0) + 1;
    return null;
  }
}
