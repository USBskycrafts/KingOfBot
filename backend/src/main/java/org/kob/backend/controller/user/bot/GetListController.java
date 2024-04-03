package org.kob.backend.controller.user.bot;

import org.kob.backend.pojo.Bot;
import org.kob.backend.service.user.bot.GetListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetListController {
    @Autowired
    private GetListService getListService;

    @GetMapping("/user/bot/get-list/")
    public List<Bot> getList() {
        return getListService.getList();
    }
}
