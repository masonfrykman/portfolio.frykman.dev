import 'package:uuid/uuid.dart';

class HitManager {
  Map<String, Map<String, int>> hits = {};
  Map<String, Map<String, String>> attributes = {};

  static Map<String, String> _getCookies(String header) {
    final cookies = header.split("; ");
    final map = <String, String>{};
    for (var cookie in cookies) {
      final spl = cookie.split("=");
      if (spl.length < 2) continue;

      map[spl.first] = spl[1];
    }
    return map;
  }

  String? hit(String? cookieHeader, {String path = "unspecified"}) {
    String? id = _getCookies(cookieHeader ?? "")["sid"];

    // If they don't have a valid id, make a new one and return it
    if (id == null || !hits.containsKey(id)) {
      var newID = Uuid().v4();
      hits[newID] = {};
      hits[newID]![path] = 1;
      attributes[newID] = {};
      return newID;
    }

    // Otherwise, log their hit and return null.
    hits[id]![path] = (hits[id]![path] ?? 0) + 1;
    return null;
  }

  void userAgent(String? cookieHeader, {String? id}) {
    final cookies = _getCookies(cookieHeader ?? "");

    String? sid = _getCookies(cookieHeader ?? "")["sid"] ?? id;
    if (sid == null) return;

    if (!cookies.containsKey("User-Agent")) return;

    attributes[sid] ??= {};
    attributes[sid]!["User-Agent"] = cookies["User-Agent"]!;
  }
}
