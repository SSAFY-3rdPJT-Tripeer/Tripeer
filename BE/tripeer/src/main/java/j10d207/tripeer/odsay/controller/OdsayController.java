package j10d207.tripeer.odsay.controller;

import j10d207.tripeer.odsay.db.dto.OptimizeDto;
import j10d207.tripeer.odsay.db.dto.OptimizeListDTO;
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
    public String getOdsay() throws IOException {

//        odsayService.getOdsay();
        return odsayService.getOdsay(126.734086,37.715133,128.7384361,35.3959361); //밀양
//        return odsayService.getOdsay(126.734086,37.715133,127.179108,37.245635); //수원
    }

    @PostMapping("/optimization")
    public void getAlgo(@RequestBody OptimizeListDTO optimizeListDTO) {
        algorithmService.shortestPathAlgorithm(optimizeListDTO);
    }
}
