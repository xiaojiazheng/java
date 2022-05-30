package com.xiaojz.chatroom.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginController {
    @RequestMapping(value = "/login")
    public ModelAndView login(){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("login");
        return mv;
    }
    @RequestMapping("/chat")
    public ModelAndView go(@RequestParam("name") String name){
        ModelAndView mv = new ModelAndView();
        if(name.isEmpty())
            mv.setViewName("login");
        else{
            mv.addObject("name",name);
            mv.setViewName("chat");
        }
        return mv;
    }
}
