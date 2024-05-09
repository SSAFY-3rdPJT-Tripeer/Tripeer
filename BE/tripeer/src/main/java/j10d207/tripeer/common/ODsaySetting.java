package j10d207.tripeer.common;


import jakarta.annotation.PostConstruct;
import lombok.Getter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Component
public class ODsaySetting {

    @Value("${odsay.list1}")
    private String list1;
    @Value("${odsay.list2}")
    private String list2;
    @Value("${odsay.list3}")
    private String list3;
    @Value("${odsay.list4}")
    private String list4;
    @Value("${odsay.list5}")
    private String list5;
    @Value("${odsay.list6}")
    private String list6;
    @Value("${odsay.list7}")
    private String list7;
    @Value("${odsay.list8}")
    private String list8;
    @Value("${odsay.list9}")
    private String list9;
    @Value("${odsay.list10}")
    private String list10;
    @Value("${odsay.list11}")
    private String list11;
    @Value("${odsay.list12}")
    private String list12;
    @Value("${odsay.list13}")
    private String list13;
    @Value("${odsay.list14}")
    private String list14;
    @Value("${odsay.list15}")
    private String list15;
    @Value("${odsay.list16}")
    private String list16;
    @Value("${odsay.list17}")
    private String list17;

    private List<String> list;

    public ODsaySetting() {
        list = new ArrayList<>();
    }

    @PostConstruct
    private void init() {
        list.add(list1);
        list.add(list2);
        list.add(list3);
        list.add(list4);
        list.add(list5);
        list.add(list6);
        list.add(list7);
        list.add(list8);
        list.add(list9);
        list.add(list10);
        list.add(list11);
        list.add(list12);
        list.add(list13);
        list.add(list14);
        list.add(list15);
        list.add(list16);
        list.add(list17);
    }
}
