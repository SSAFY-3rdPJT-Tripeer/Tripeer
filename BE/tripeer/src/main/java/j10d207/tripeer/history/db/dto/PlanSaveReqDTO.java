package j10d207.tripeer.history.db.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class PlanSaveReqDTO {
    @Schema(description = "테스트 값", example = "abcd")
    private long planId;
    private List<List<Map<String, String>>> totalYList;
    private List<List<Object>> timeYList;
}
