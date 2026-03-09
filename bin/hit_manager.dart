import 'dart:async';

import 'package:uuid/uuid.dart';

final HitManager hm = HitManager();

class HitManager {
  Map<String, int> hits = {};

  int hitsToday = 0;
  int hitsYesterday = 0;
  int hitsTotal = 0;

  HitManager() {
    _dailyRefresh(); // call immediately to schedule
  }

  void _dailyRefresh() {
    hitsYesterday = hitsToday;
    hitsToday = 0;

    // use Future.delayed to schedule the next refresh at midnight UTC.
    DateTime oneDay = DateTime.now()
      ..add(Duration(days: 1))
      ..toUtc();

    DateTime midnight = DateTime.utc(
      oneDay.year,
      oneDay.month,
      oneDay.day,
      0,
      0,
      0,
      0,
      0,
    );

    Duration schedule = midnight.difference(DateTime.now().toUtc());
    Future.delayed(schedule, _dailyRefresh);
  }

  String? hit(String? cookieHeader) {
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
      hits[newID] = 1;
      hitsToday++;
      hitsTotal++;
      return newID;
    }

    // Otherwise, log their hit and return null.
    int x = hits[id]!;
    x++;
    hitsToday++;
    hitsTotal++;
    hits[id] = x;
    return null;
  }
}
