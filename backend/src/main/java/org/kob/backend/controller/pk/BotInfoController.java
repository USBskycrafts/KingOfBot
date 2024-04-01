package org.kob.backend.controller.pk;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pk/")
public class BotInfoController {

    @RequestMapping("bot-info/")
    Map<String, String> getBotInfo() {
        Map<String, String> map = new HashMap<>();
        map.put("name", "Alice");
        map.put("rating", "1500");
        return map;
    }
}
