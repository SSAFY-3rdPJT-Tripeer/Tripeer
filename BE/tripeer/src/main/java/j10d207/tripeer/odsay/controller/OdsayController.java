package j10d207.tripeer.odsay.controller;

import j10d207.tripeer.odsay.service.AlgorithmService;
import j10d207.tripeer.odsay.service.AlgorithmServiceImpl;
import j10d207.tripeer.odsay.service.OdsayService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@AllArgsConstructor
@RequestMapping("/odsay")
public class OdsayController {

    private final OdsayService odsayService;
    private final AlgorithmService algorithmService;


    @GetMapping("/test")
    public StringBuilder getOdsay() throws IOException {

//        odsayService.getOdsay();
        return odsayService.getOdsay();
    }

    @GetMapping("/optimization/{planDayId}")
    public void getAlgo(@PathVariable("planDayId") Long planDayId) {
        algorithmService.shortestPathAlgorithm(planDayId);
    }
}
