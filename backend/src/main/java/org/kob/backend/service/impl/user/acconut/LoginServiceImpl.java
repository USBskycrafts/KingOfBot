package org.kob.backend.service.impl.user.acconut;


import org.kob.backend.pojo.User;
import org.kob.backend.service.impl.utils.UserDetailsImpl;
import org.kob.backend.service.user.account.LoginService;
import org.kob.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {


    @Autowired
    private AuthenticationManager authorizationManager;
    @Override
    public Map<String, String> getToken(String username, String password) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);
        Map<String, String> json = new HashMap<>();
        try {
            Authentication authenticate = authorizationManager.authenticate(authenticationToken);


            UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
            User user = loginUser.getUser();

            String jwt = JwtUtil.createJWT(user.getId().toString());
            json.put("error-message", "success");
            json.put("token", jwt);
            return json;
        } catch (Exception e) {
            json.put("error-message", "login error");
            return json;
        }
    }
}
