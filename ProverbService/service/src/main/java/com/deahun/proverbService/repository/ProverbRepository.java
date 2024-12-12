package com.deahun.proverbService.repository;

import com.deahun.proverbService.domain.Proverb;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProverbRepository extends JpaRepository<Proverb, Long>{
}
