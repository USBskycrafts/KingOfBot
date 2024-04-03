package org.kob.backend.service.impl.user.bot;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.kob.backend.mapper.BotMapper;
import org.kob.backend.pojo.Bot;
import org.kob.backend.pojo.User;
import org.kob.backend.service.impl.utils.UserDetailsImpl;
import org.kob.backend.service.user.bot.RemoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RemoveServiceImpl implements RemoveService {
    @Autowired
    private BotMapper botMapper;
    @Override
    public Map<String, String> remove(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser =  (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        int botId = Integer.parseInt(data.get("bot-id"));
        Bot bot = botMapper.selectById(botId);
        Map<String, String> json = new HashMap<>();
        if (bot == null) {
            json.put("error-message", "bot not exist");
            return json;
        }

        if (!bot.getUserid().equals(user.getId())) {
            json.put("error-message", "no authentication");
            return json;
        }

        botMapper.deleteById(botId);
        json.put("error-message", "success");
        return json;
    }
}
