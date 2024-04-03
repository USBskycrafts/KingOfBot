package org.kob.backend.service.impl.user.bot.utils;

import org.kob.backend.pojo.User;

import java.util.HashMap;
import java.util.Map;

public class CheckBotValidation {
    public static Map<String, String> checkUserInput(User user, Map<String, String> data) {
        String title = data.get("title");
        String description = data.get("description");
        String content =  data.get("content");

        Map<String, String> json = new HashMap<>();
        if (title == null || title.isEmpty()) {
            json.put("error-message", "empty title");
            return json;
        }

        if (title.length() > 100) {
            json.put("error-message", "title cannot be longer than 100");
            return json;
        }

        if (description != null && description.length() > 300) {
            json.put("error-message", "description cannot be longer than 100");
            return json;
        }

        if (content == null) {
            json.put("error-message", "empty content(code)");
            return json;
        }

        if (content.length() > 100000) {
            json.put("error-message", "content cannot be longer than 100");
            return json;
        }

        json.put("error-message", "success");
        return json;
    }
}
