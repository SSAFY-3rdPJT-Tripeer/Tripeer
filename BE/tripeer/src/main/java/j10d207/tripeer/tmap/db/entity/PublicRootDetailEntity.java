package j10d207.tripeer.tmap.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "public_root_detail")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicRootDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long publicRootDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PUBLIC_ROOT_ID")
    private PublicRootEntity publicRoot;

    private String startName;
    private double startLat;
    private double startLon;
    private String endName;
    private double endLat;
    private double endLon;
    private int distance;
    private int sectionTime;
    private String mode;
    private String route;
}
