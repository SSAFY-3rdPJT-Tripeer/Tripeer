package j10d207.tripeer.place.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import j10d207.tripeer.place.db.dto.SpotAddReqDto;
import j10d207.tripeer.place.service.CityService;
import j10d207.tripeer.place.service.SpotService;
import j10d207.tripeer.place.service.TownService;
import j10d207.tripeer.plan.service.PlanService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;



@WebMvcTest(PlaceController.class)
class PlaceControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    CityService cityService;
    @MockBean
    TownService townService;
    @MockBean
    SpotService spotService;
    @MockBean
    PlanService planService;


//    @Test
//    @DisplayName("place 테스트")
//    void getPlaceTest() throws Exception {
//        SpotAddReqDto spotAddReqDto = SpotAddReqDto.builder()
//                .title("테스트").build();
//
//
////        given(spotService.createNewSpot(spotAddReqDto, `))
//
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/place/wishList/{spotInfoId}")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsBytes(spotAddReqDto))
//                )
//                .andExpect(status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.title").exists())
//                .andDo(print());
//
//    }

}