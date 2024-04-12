package j10d207.tripeer.user.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity(name = "individual_bucket")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndividualBucketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long individualBucketId;

    @ManyToOne
    @JoinColumn(name = "COWORKER_ID")
    private CoworkerEntity coworker;

//    @ManyToOne
//    @JoinColumn(name = "SPOT_INFO_ID")
//    private SpotInfoEntity spotInfo;


}
