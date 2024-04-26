package j10d207.tripeer.odsay.controller;

import j10d207.tripeer.odsay.service.AlgorithmService;
import j10d207.tripeer.odsay.service.AlgorithmServiceImpl;
import j10d207.tripeer.odsay.service.OdsayService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/test2")
    public void getOdsay2(@RequestParam("SX") double SX, @RequestParam("SY") double SY, @RequestParam("EX") double EX, @RequestParam("EY") double EY) {
        odsayService.getPublicTime(SX, SY, EX, EY);
//        return odsayService.getOdsay();
    }

    @GetMapping("/optimization/{planDayId}")
    public void getAlgo(@PathVariable("planDayId") Long planDayId) {
        algorithmService.shortestPathAlgorithm(planDayId);
    }
}
