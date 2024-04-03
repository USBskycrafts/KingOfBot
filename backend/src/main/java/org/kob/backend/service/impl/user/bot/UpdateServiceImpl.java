package org.kob.backend.service.impl.user.bot;


import org.kob.backend.mapper.BotMapper;
import org.kob.backend.pojo.Bot;
import org.kob.backend.pojo.User;
import org.kob.backend.service.impl.user.bot.utils.CheckBotValidation;
import org.kob.backend.service.impl.utils.UserDetailsImpl;
import org.kob.backend.service.user.bot.UpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class UpdateServiceImpl implements UpdateService {

    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> update(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        Integer botId = Integer.parseInt(data.get("bot-id"));
        Bot bot = botMapper.selectById(botId);
        Map<String, String> json = new HashMap<>();
        if (bot == null) {
            json.put("error-message", "Bot not exist");
            return json;
        }

        if (!bot.getUserid().equals(user.getId())) {
            json.put("error-message", "no authentication");
            return json;
        }

        json = CheckBotValidation.checkUserInput(user, data);
        if (json.get("error-message").equals("success")) {
            bot.setContent(data.get("content"));
            bot.setTitle(data.get("title"));
            bot.setDescription(data.get("description"));
            bot.setModifyAt(new Date());
            botMapper.updateById(bot);
        }
        return json;
    }
}
