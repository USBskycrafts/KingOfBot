package org.kob.backend.service.impl.user.bot;


import org.kob.backend.mapper.BotMapper;
import org.kob.backend.pojo.Bot;
import org.kob.backend.pojo.User;
import org.kob.backend.service.impl.user.bot.utils.CheckBotValidation;
import org.kob.backend.service.impl.utils.UserDetailsImpl;
import org.kob.backend.service.user.bot.AddService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddServiceImpl implements AddService {

    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> add(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();
        Map<String, String> json = CheckBotValidation.checkUserInput(user, data);
        if (json.get("error-message").equals("success")) {
            String title = data.get("title");
            String description = data.get("description");
            String content =  data.get("content");
            Date now = new Date();
            Bot bot = new Bot(null, user.getId(), title, description, content, 1500, now, now);
            botMapper.insert(bot);
        }
        return json;
    }
}
