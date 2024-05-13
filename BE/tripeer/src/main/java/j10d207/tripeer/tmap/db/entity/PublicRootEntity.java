package j10d207.tripeer.tmap.db.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "public_root")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicRootEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long publicRootId;

    private double startLat;
    private double startLon;
    private double endLat;
    private double endLon;
    private int totalDistance;
    private int totalWalkTime;
    private int totalWalkDistance;
    private int pathType;
    private int totalFare;
    private int totalTime;


}
