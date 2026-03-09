import 'dart:async';

import 'package:rbws/rbws.dart';

import '../hit_manager.dart';

Map<(RBWSMethod, String), FutureOr<RBWSResponse> Function(RBWSRequest)> analytics_v1_api = {
  (.get, "/api/analytics/v1/totals"): (req) {
    return RBWSResponse.dataFromString(HTTPStatusCode.ok, "${hm.hitsToday} ${hm.hitsYesterday} ${hm.hitsTotal}", headers: {"Content-Type": "text/plain", "X-Hint": "${hm.hits.length}", "Cache-Control": "no-store"});
  },

  (.get, "/api/analytics/v1/individuals/totals"): (req) {
    return RBWSResponse.dataFromString(HTTPStatusCode.ok, "${hm.hits.length}", toRequest: req, headers: {"Cache-Control": "no-store"});
  },

  (.get, "/api/analytics/v1/individuals/enumerate"): (req) {
    if(hm.hits.isEmpty) {
      return RBWSResponse.dataFromString(HTTPStatusCode.notFound, "No hits!", toRequest: req, headers: {"Content-Type": "text/plain", "Cache-Control": "no-store"});
    }

    if(!req.headers.containsKey("X-Offset") || !req.headers.containsKey("X-Amount")) {
      return RBWSResponse.dataFromString(HTTPStatusCode.badRequest, "Missing headers 'X-Offset' and 'X-Amount'.", toRequest: req, headers: {"Content-Type": "text/plain", "Cache-Control": "no-store"});
    }

    final offset = int.tryParse(req.headers["X-Offset"] ?? "") ?? -1;
    var amount = int.tryParse(req.headers["X-Amount"] ?? "") ?? -1;
    
    if(offset < 0 || offset >= hm.hits.length || amount < 1) {
      return RBWSResponse.dataFromString(HTTPStatusCode.badRequest, "Invalid headers 'X-Offset' and/or 'X-Amount'.", toRequest: req, headers: {"Content-Type": "text/plain", "Cache-Control": "no-store"});
    }
    if(offset + amount > hm.hits.length) {
      amount = hm.hits.length - offset;
    }

    var collection = "";
    final entryList = hm.hits.entries.toList();
    int x = 0;
    for(int i = offset; i < offset + amount; i++, x++) {
      final entry = entryList[i];
      collection += "$i ${entry.key} ${entry.value}\n";
    }

    return RBWSResponse.dataFromString(HTTPStatusCode.ok, collection, toRequest: req, headers: {"Content-Type": "text/plain", "X-Amount": "$x", "Cache-Control": "no-store"});
  }
};