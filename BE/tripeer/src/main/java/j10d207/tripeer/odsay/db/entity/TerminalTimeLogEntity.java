package j10d207.tripeer.odsay.db.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "terminal_time_log")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TerminalTimeLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long terminalTimeLogId;

    private double startLat;
    private double startLon;
    private double endLat;
    private double endLon;
    private int time;
}
