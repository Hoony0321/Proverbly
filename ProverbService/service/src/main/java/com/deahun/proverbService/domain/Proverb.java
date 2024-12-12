package com.deahun.proverbService.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "proverb")
public class Proverb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 500)
    private String meaning;

    @Column(columnDefinition = "text[]")
    @Type(value = CustomStringArrayType.class)
    private String[] examples;
}
