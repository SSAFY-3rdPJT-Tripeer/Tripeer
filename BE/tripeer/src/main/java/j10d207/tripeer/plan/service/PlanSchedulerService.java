package j10d207.tripeer.plan.service;

import j10d207.tripeer.email.db.dto.EmailDTO;
import j10d207.tripeer.email.service.EmailService;
import j10d207.tripeer.plan.db.entity.PlanEntity;
import j10d207.tripeer.plan.db.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanSchedulerService {

    private final TaskScheduler taskScheduler;
    private final EmailService emailService;
    private final PlanRepository planRepository;


    // 특정 Plan에 대한 작업 스케줄링
    public void schedulePlanTasks(PlanEntity plan) {
        if (plan.getStartDate() != null) {
            scheduleTask(plan.getStartDate().atStartOfDay().plusHours(13).atZone(ZoneId.systemDefault()).toInstant(), () -> startPlan(plan));
        }
        if (plan.getEndDate() != null) {
            scheduleTask(plan.getEndDate().atStartOfDay().plusHours(13).atZone(ZoneId.systemDefault()).toInstant(), () -> endPlan(plan));
        }
    }

    // Instant를 사용하여 스케줄 설정
    private void scheduleTask(Instant instant, Runnable task) {
        // 스케줄러가 Instant에 기반하여 작업을 스케줄
        taskScheduler.schedule(task, instant);
    }

    // 시작 날짜에 실행할 메서드
    private void startPlan(PlanEntity plan) {
        LocalDate startDate = plan.getStartDate();

        EmailDTO emailDTO = EmailDTO.builder()
                .title("내일 여행이 시작됩니다.")
                .content(startDate + "부터 여행이 시작됩니다! 여행계획을 확인해보세요!")
                .build();
        emailService.sendEmail(emailDTO);
    }

    // 종료 날짜에 실행할 메서드
    private void endPlan(PlanEntity plan) {
        String title = plan.getTitle();

        EmailDTO emailDTO = EmailDTO.builder()
                .title("여행 잘 다녀 오셨나요?")
                .content("다이어리에서 "+ title + "여행의 추억을 확인해보세요!")
                .build();
        emailService.sendEmail(emailDTO);
    }
}
