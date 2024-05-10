package j10d207.tripeer.odsay.controller;

import j10d207.tripeer.odsay.service.AlgorithmService;
import j10d207.tripeer.odsay.service.OdsayService;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.response.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

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

    @GetMapping("/test2")
    public Response<Integer> getOdsay2(@RequestParam("SX") double SX, @RequestParam("SY") double SY, @RequestParam("EX") double EX, @RequestParam("EY") double EY) {
        int result = odsayService.getPublicTime(SX, SY, EX, EY, null).getTime();
//        return odsayService.getOdsay();
        return Response.of(HttpStatus.OK, "조회완료", result);
    }

    @PostMapping("/test3")
    public Response<List<PlanDetailResDTO>> getOdsay3(@RequestParam("planDayId") long planDayId) {
        try {
            List<PlanDetailResDTO> result = algorithmService.getShortTime(planDayId);
            return Response.of(HttpStatus.OK, "경로 최적화 완료", result);
        } catch (Exception e) {
            System.out.println("e.getMessage() = " + e.getMessage());
            throw new RuntimeException();
        }
    }

//    @GetMapping("/optimization/{planDayId}")
//    public void getAlgo(@PathVariable("planDayId") Long planDayId) {
//        algorithmService.shortestPathAlgorithm(planDayId);
//    }
}
