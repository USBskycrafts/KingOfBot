package org.kob.backend.service.impl.acconut;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.kob.backend.mapper.UserMapper;
import org.kob.backend.pojo.User;
import org.kob.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {


    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, String> register(String username, String password, String confirmedPassword) {
        Map<String, String> json = new HashMap<>();
        if (username == null) {
            json.put("error-message", "empty username");
            return json;
        }
        if (password == null || confirmedPassword == null) {
            json.put("error-message", "empty password");
            return json;
        }

        if (!password.equals(confirmedPassword)) {
            json.put("error-message", "2 passwords does not alias");
            return json;
        }

        username = username.trim();
        if (username.isEmpty()) {
            json.put("error-message", "empty username");
            return json;
        }



        if (username.length() > 100) {
            json.put("error-message", "username too long");
            return json;
        }


        if (password.length() > 100) {
            json.put("error-message", "password too long");
            return json;
        }

        QueryWrapper<User> queryWrapper = new QueryWrapper<User>();
        queryWrapper.eq("username", username);
        List<User> users = userMapper.selectList(queryWrapper);
        if (!users.isEmpty()) {
            json.put("error-message", "user exist");
            return json;
        }
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(null, username, encodedPassword, null);
        userMapper.insert(user);
        json.put("error-message", "success");
        return json;
    }
}
