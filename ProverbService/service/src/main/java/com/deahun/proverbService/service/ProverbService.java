package com.deahun.proverbService.service;

import com.deahun.proverbService.domain.Proverb;
import com.deahun.proverbService.repository.ProverbRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProverbService {
    private final ProverbRepository proverbRepository;

    public List<Proverb> findAllProverb(){
        return proverbRepository.findAll();
    }

    public Proverb findRandomProverb(){
        List<Proverb> allProverb = findAllProverb();
        int randomIndex = (int)(Math.random() * allProverb.size());
        return allProverb.get(randomIndex);
    }

    public Proverb findProverbById(Long id) {
        Optional<Proverb> findOne = proverbRepository.findById(id);
        if(findOne.isEmpty()) {
            throw new IllegalArgumentException("해당 id에 해당하는 속담이 없습니다.");
        }

        return findOne.get();
    }
}
