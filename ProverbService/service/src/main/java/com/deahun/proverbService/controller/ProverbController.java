package com.deahun.proverbService.controller;

import com.deahun.proverbService.domain.Proverb;
import com.deahun.proverbService.service.ProverbService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Controller
public class ProverbController {

    private final ProverbService proverbService;

    @GetMapping("proverbs")
    public Object getAllProverbs(){
        List<Proverb> allProverb = proverbService.findAllProverb();
        return allProverb;
    }

    @GetMapping("proverb")
    public Object getRandomProverb(){
        Proverb randomProverb = proverbService.findRandomProverb();
        return randomProverb;
    }


}
